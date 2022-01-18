const { ModelAuthTransformer } = require('graphql-auth-transformer');
const { ModelConnectionTransformer } = require('graphql-connection-transformer');
const { KeyTransformer } = require('graphql-key-transformer');
const { DynamoDBModelTransformer } = require('graphql-dynamodb-transformer');
const { GraphQLTransform } = require('graphql-transformer-core');
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');

const SCHEMA = fs.readFileSync('../common/graphql/amplify-schema.graphql').toString();
const transformer = new GraphQLTransform({
 transformers: [
  new DynamoDBModelTransformer(),
  new ModelConnectionTransformer(),
  new KeyTransformer(),
  new ModelAuthTransformer({
   authConfig: {
    defaultAuthentication: {
     authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    },
   },
  }),
 ],
 featureFlags: {
   getBoolean: () => true,
 }
});


const out = transformer.transform(SCHEMA);
fs.writeFileSync('../common/graphql/schema.graphql', out.schema);
fsExtra.emptyDirSync('../../vtl');


Object.keys(out.resolvers).forEach(key => {
  const vtl = out.resolvers[key];
  fs.writeFileSync(path.resolve('../../vtl', key), vtl);
});