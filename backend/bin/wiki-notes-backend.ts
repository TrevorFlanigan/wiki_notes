#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WikiNotesDynamoDBStack } from "../lib/wiki-notes-dynamodb-stack";
import { WikiNotesAppSyncStack } from "../lib/wiki-notes-appsync-stack";

const app = new cdk.App();
new WikiNotesDynamoDBStack(app, "WikiNotesDynamoDBStack", {
  env: {
    region: "us-east-1",
  },
});
new WikiNotesAppSyncStack(app, "WikiNotesAppSyncStack", {
  env: {
    region: "us-east-1",
  },
});
