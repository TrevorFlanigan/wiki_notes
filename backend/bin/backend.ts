#!/usr/bin/env node
import "source-map-support/register";
import { App, StackProps } from "@aws-cdk/core";
import { WikiNotesDynamoDBStack } from "../lib/wiki-notes-dynamodb-stack";
import { WikiNotesAppSyncStack } from "../lib/wiki-notes-appsync-stack";
import { WikiNotesCognitoStack } from "../lib/wiki-notes-cognito-stack";

const stackProps: StackProps = {
  env: {
    region: "us-east-1",
  },
};
const app = new App();
new WikiNotesDynamoDBStack(app, "WikiNotesDynamoDBStack", stackProps);
const cognito = new WikiNotesCognitoStack(
  app,
  "WikiNotesCognitoStack",
  stackProps
);
const appsync = new WikiNotesAppSyncStack(
  app,
  "WikiNotesAppSyncStack",
  cognito.UserPoolId,
  stackProps
);
