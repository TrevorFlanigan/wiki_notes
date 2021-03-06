import { CfnOutput, Construct, Stack, StackProps } from "@aws-cdk/core";
import {
  AuthorizationType,
  FieldLogLevel,
  GraphqlApi,
  MappingTemplate,
  Schema,
  UserPoolDefaultAction,
} from "@aws-cdk/aws-appsync";
import { UserPool } from "@aws-cdk/aws-cognito";
import { Table } from "@aws-cdk/aws-dynamodb";
import {
  CompositePrincipal,
  ManagedPolicy,
  Role,
  PolicyDocument,
  ServicePrincipal,
  Effect,
  PolicyStatement,
} from "@aws-cdk/aws-iam";
import { WikiNotesDynamoDBStack } from "./wiki-notes-dynamodb-stack";
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");
import { WikiNotesCognitoStack } from "./wiki-notes-cognito-stack";

/**
 * WikiNotesAppSyncStack defines a GraphQL API for accessing DynamoDB tables.
 *
 */
export class WikiNotesAppSyncStack extends Stack {
  public readonly GraphQLUrl: string;

  constructor(
    scope: Construct,
    id: string,
    userPoolId: string,
    props?: StackProps
  ) {
    super(scope, id, props);

    const authorizationType = AuthorizationType.USER_POOL;
    const userPool = UserPool.fromUserPoolId(this, "UserPool", userPoolId);
    const api = new GraphqlApi(this, "wikiNotesGraphQLAPI", {
      name: "wikiNotesGraphQLAPI",
      schema: Schema.fromAsset("src/util/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: authorizationType,
          userPoolConfig: {
            userPool: userPool,
            defaultAction: UserPoolDefaultAction.ALLOW,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.IAM,
          },
        ],
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
    });
    this.GraphQLUrl = api.graphqlUrl;

    // Create AppSyncRole
    const wikiNotesAppSyncRole = new Role(this, "wikiNotesAppSyncRole", {
      roleName: "wiki-notes-app-sync-role",
      assumedBy: new CompositePrincipal(
        new ServicePrincipal("appsync.amazonaws.com"),
        new ServicePrincipal("lambda.amazonaws.com")
      ),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"),
        ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess"),
        ManagedPolicy.fromAwsManagedPolicyName("AWSAppSyncInvokeFullAccess"),
      ],
    });

    wikiNotesAppSyncRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["sts:AssumeRole"],
        resources: ["*"],
      })
    );

    // DynamoDB DataSource

    generateDataSourceAndMappingTemplates(
      api,
      wikiNotesAppSyncRole,
      this,
      WikiNotesDynamoDBStack.NOTES_TABLE_NAME,
      "note",
      "notes"
    );

    generateDataSourceAndMappingTemplates(
      api,
      wikiNotesAppSyncRole,
      this,
      "users",
      "user",
      "users"
    );
    // DataSource to connect to meeting-detail DDB table
    // Import meeting-detail DDB table and grant AppSync to access the DDB table
    // const notesTable = Table.fromTableAttributes(this, "notesTable", {
    //   tableName: WikiNotesDynamoDBStack.NOTES_TABLE_NAME,
    // });
    // notesTable.grantFullAccess(wikiNotesAppSyncRole);

    // // // Define Request DDB DataSource
    // const notesTableDataSource = api.addDynamoDbDataSource(
    //   "notesTableDataSource",
    //   notesTable
    // );

    // notesTableDataSource.createResolver({
    //   typeName: "Query",
    //   fieldName: "getNote",
    //   ...generateMappingTemplate(MappingTemplateType.QUERY, "getNote"),
    // });

    // notesTableDataSource.createResolver({
    //   typeName: "Query",
    //   fieldName: "listNotes",
    //   ...generateMappingTemplate(MappingTemplateType.QUERY, "listNotes"),
    // });

    // notesTableDataSource.createResolver({
    //   typeName: "Mutation",
    //   fieldName: "createNote",
    //   ...generateMappingTemplate(MappingTemplateType.MUTATION, "createNote"),
    // });

    // notesTableDataSource.createResolver({
    //   typeName: "Mutation",
    //   fieldName: "deleteNote",
    //   ...generateMappingTemplate(MappingTemplateType.MUTATION, "deleteNote"),
    // });

    // notesTableDataSource.createResolver({
    //   typeName: "Mutation",
    //   fieldName: "updateNote",
    //   ...generateMappingTemplate(MappingTemplateType.MUTATION, "updateNote"),
    // });

    // Cloudformation Outputs
    new CfnOutput(this, "GraphQLEndpoint", {
      value: api.graphqlUrl,
    });

    new CfnOutput(this, "GraphQLAuthorizationType", {
      value: authorizationType,
    });
  }
}

enum MappingTemplateType {
  "QUERY",
  "MUTATION",
}

// Links to the VTL files
const generateMappingTemplate = (
  type: MappingTemplateType,
  mappingName: string
) => {
  switch (type) {
    case MappingTemplateType.QUERY:
      return {
        requestMappingTemplate: MappingTemplate.fromFile(
          `./vtl/Query.${mappingName}.req.vtl`
        ),
        responseMappingTemplate: MappingTemplate.fromFile(
          `./vtl/Query.${mappingName}.res.vtl`
        ),
      };
    case MappingTemplateType.MUTATION:
      return {
        requestMappingTemplate: MappingTemplate.fromFile(
          `./vtl/Mutation.${mappingName}.req.vtl`
        ),
        responseMappingTemplate: MappingTemplate.fromFile(
          `./vtl/Mutation.${mappingName}.res.vtl`
        ),
      };
    default:
      throw new Error("Invalid template type");
  }
};

const generateDataSourceAndMappingTemplates = (
  api: GraphqlApi,
  appSyncRole: Role,
  app: Construct,
  tableName: string,
  singular: string,
  plural = singular + "s"
) => {
  const titleCase = singular.charAt(0).toUpperCase() + singular.slice(1);
  const titleCases = plural.charAt(0).toUpperCase() + plural.slice(1);

  const table = Table.fromTableAttributes(app, `${plural}Table`, {
    tableName,
  });
  table.grantFullAccess(appSyncRole);

  const dataSource = api.addDynamoDbDataSource(
    `${plural}TableDataSource`,
    table
  );

  dataSource.createResolver({
    typeName: "Query",
    fieldName: `get${titleCase}`,
    ...generateMappingTemplate(MappingTemplateType.QUERY, `get${titleCase}`),
  });

  dataSource.createResolver({
    typeName: "Query",
    fieldName: `list${titleCases}`,
    ...generateMappingTemplate(MappingTemplateType.QUERY, `list${titleCases}`),
  });

  dataSource.createResolver({
    typeName: "Mutation",
    fieldName: `create${titleCase}`,
    ...generateMappingTemplate(
      MappingTemplateType.MUTATION,
      `create${titleCase}`
    ),
  });

  dataSource.createResolver({
    typeName: "Mutation",
    fieldName: `delete${titleCase}`,
    ...generateMappingTemplate(
      MappingTemplateType.MUTATION,
      `delete${titleCase}`
    ),
  });

  dataSource.createResolver({
    typeName: "Mutation",
    fieldName: `update${titleCase}`,
    ...generateMappingTemplate(
      MappingTemplateType.MUTATION,
      `update${titleCase}`
    ),
  });
};
