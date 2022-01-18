// User Profile Data Access Object
import { DocumentClient } from "aws-sdk/clients/dynamodb";
export type UserProfile = {
  name: string; // Full Name (e.g. "John Doe")
  phone_number: string; // Phone Number (e.g. "+16041111111")
  email: string; // Email (e.g. "abc@xyz.com")
  username: string; // Username (e.g. john.doe)
};

// This must be consistent with the Table Name in WikiNotesDynamoDBStack
const WikiNotesDynamoDBStack = {
  USER_TABLE_NAME: "users",
};

export class UserProfileDao {
  db: DocumentClient;

  constructor(db: DocumentClient) {
    this.db = db;
  }

  /**
   * Create a user profile.
   *
   * @param userProfile The user profile to save.
   */
  async createUserProfile(userProfile: UserProfile): Promise<Boolean> {
    const existingUserProfile = await this.getUserProfile(userProfile.email);
    if (existingUserProfile) {
      // If any existing user profile exists, we should not attempt to create a new profile.
      return false;
    }

    const params = {
      TableName: WikiNotesDynamoDBStack.USER_TABLE_NAME,
      Item: userProfile,
    };
    await this.db.put(params).promise();
    return true;
  }

  /**
   * Saves a user profile.
   *
   * @param userProfile The user profile to save.
   */
  async saveUserProfile(userProfile: UserProfile): Promise<void> {
    const params = {
      TableName: WikiNotesDynamoDBStack.USER_TABLE_NAME,
      Item: userProfile,
    };

    await this.db.put(params).promise();
  }

  /**
   * Retrieves a first responder profile by their username.
   *
   * @param username Gets a user profile by their username.
   * @returns The meeting if it exists.
   */
  async getUserProfile(username: string): Promise<UserProfile> {
    const params: DocumentClient.GetItemInput = {
      TableName: WikiNotesDynamoDBStack.USER_TABLE_NAME,
      Key: {
        username: username,
      },
    };
    const result = await this.db.get(params).promise();
    return result?.Item as UserProfile;
  }

  /**
   * Retrieves all user profiles that match the provided search parameters.
   *
   * @returns The user profiles.
   */
  async getUserProfiles(): Promise<UserProfile[]> {
    const params: DocumentClient.QueryInput = {
      TableName: WikiNotesDynamoDBStack.USER_TABLE_NAME,
    };

    const scanResults: UserProfile[] = [];
    var items: DocumentClient.QueryOutput;
    do {
      items = await this.db.query(params).promise();
      items.Items?.forEach((item) => {
        const a = item as UserProfile;
        scanResults.push(a);
      });
      params["ExclusiveStartKey"] = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    return scanResults;
  }
}
