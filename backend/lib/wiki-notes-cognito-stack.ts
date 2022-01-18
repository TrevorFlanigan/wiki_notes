import { CfnOutput, Construct, Stack, StackProps } from "@aws-cdk/core";
import {
  AccountRecovery,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolClient,
  DateTimeAttribute,
  UserPool,
  VerificationEmailStyle,
} from "@aws-cdk/aws-cognito";
import {
  Role,
  FederatedPrincipal,
  ManagedPolicy,
  ServicePrincipal,
  PolicyDocument,
  PolicyStatement,
  Effect,
} from "@aws-cdk/aws-iam";
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");

/**
 * FirstResponderAdminCognitoStack defines a Cognito User and Identity Pool. The user pool will be used for authenticating
 * users into First Responder Admin Website and authenticating APIs.
 */
export class WikiNotesCognitoStack extends Stack {
  public readonly UserPoolId: string;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const lambdaRole = new Role(this, "WikiNotesCognitoLambdaRole", {
      roleName: "WikiNotesCognitoLambdaRole",
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        additional: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                // DynamoDB
                "dynamodb:Scan",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:BatchWriteItem",
                "dynamodb:BatchGetItem",
                // Lambda
                "lambda:InvokeFunction",
                // CloudWatch
                "cloudwatch:*",
                "logs:*",
              ],
              resources: ["*"],
            }),
          ],
        }),
      },
    });

    const createUserProfileFn = new lambda.Function(this, "CreateUserProfile", {
      functionName: "User-Create",
      code: new lambda.AssetCode("build/src"),
      handler: "user-create.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      role: lambdaRole,
    });

    // User Pool
    const userPool = new UserPool(this, "WikiNotesUserPool", {
      userPoolName: "wiki-notes-user-pool",
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Verify your email for WikiNotes!",
        emailBody:
          "Hello {username}, Thanks for signing up for WikiNotes! Your verification code is {####}",
        emailStyle: VerificationEmailStyle.CODE,
      },
      signInAliases: {
        username: true,
        email: true,
      },
      autoVerify: {
        email: true,
        phone: true,
      },
      standardAttributes: {
        fullname: {
          required: true,
          mutable: false,
        },
        address: {
          required: false,
          mutable: true,
        },
      },
      customAttributes: {
        joinedOn: new DateTimeAttribute(),
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      lambdaTriggers: {
        postConfirmation: createUserProfileFn,
      },
    });
    this.UserPoolId = userPool.userPoolId;

    // User Pool Client
    const userPoolClient = new CfnUserPoolClient(
      this,
      "WikiNotesUserPoolClient",
      {
        clientName: "WikiNotesUserPoolClient",
        userPoolId: userPool.userPoolId,
        explicitAuthFlows: ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
      }
    );

    // Identity Pool
    const identityPool = new CfnIdentityPool(this, "WikiNotesIdentityPool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.ref,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    // Unauthenticated Role
    const unauthenticatedRole = new Role(
      this,
      "WikiNotes_Unauthenticated_Role",
      {
        roleName: "WikiNotes_Unauthenticated_Role",
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );

    // Authenticated Role
    const authenticatedRole = new Role(this, "WikiNotes_Authenticated_Role", {
      roleName: "WikiNotes_Authenticated_Role",
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    authenticatedRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AWSAppSyncInvokeFullAccess")
    );

    // Identity Pool Role Attachment
    new CfnIdentityPoolRoleAttachment(
      this,
      "WikiNotesIdentityPoolRoleAttachment",
      {
        identityPoolId: identityPool.ref,
        roles: {
          unauthenticated: unauthenticatedRole.roleArn,
          authenticated: authenticatedRole.roleArn,
        },
      }
    );

    // outputs
    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.ref,
    });

    new CfnOutput(this, "IdentityPoolId", {
      value: identityPool.ref,
    });

    new CfnOutput(this, "AuthenticatedRole", {
      value: authenticatedRole.roleArn,
    });

    new CfnOutput(this, "UnauthenticatedRole", {
      value: unauthenticatedRole.roleArn,
    });
  }
}
