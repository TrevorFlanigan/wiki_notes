import { Stack, StackProps } from "@aws-cdk/core";
import * as cdk from "@aws-cdk/core";
import { Table, BillingMode, AttributeType } from "@aws-cdk/aws-dynamodb";

export class WikiNotesDynamoDBStack extends Stack {
  private static NOTES_TABLE_ID = "NotesDynamoTable";
  public static NOTES_TABLE_NAME = "notes";
  public static NOTES_KEY_NAME = "note_id";

  private static USER_TABLE_ID = "UsersDynamoTable";
  public static USER_TABLE_NAME = "users";
  public static USER_KEY_NAME = "username";
  constructor(app: cdk.App, id: string, props?: StackProps) {
    super(app, id, props);

    const userProfileTable = new Table(
      this,
      WikiNotesDynamoDBStack.USER_TABLE_ID,
      {
        tableName: WikiNotesDynamoDBStack.USER_TABLE_NAME,
        partitionKey: {
          name: WikiNotesDynamoDBStack.USER_KEY_NAME,
          type: AttributeType.STRING,
        },
        billingMode: BillingMode.PAY_PER_REQUEST,
        pointInTimeRecovery: true,
      }
    );

    const NotesTable = new Table(this, WikiNotesDynamoDBStack.NOTES_TABLE_ID, {
      tableName: WikiNotesDynamoDBStack.NOTES_TABLE_NAME,
      partitionKey: {
        name: WikiNotesDynamoDBStack.NOTES_KEY_NAME,
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
