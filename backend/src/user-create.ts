import AWS = require("aws-sdk");
import { UserProfileDao } from "./ddb/user-profile-dao";

const db = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

/**
 * Creates a new user profile after the user confirms their signup.
 */
export const handler = async (
  event: any = {},
  context: any,
  callback: any
): Promise<any> => {
  console.log("Creating user profile...");
  console.log(event);

  const userName = event["userName"];
  const name = event["request"]["userAttributes"]["name"];
  const phoneNumber = event["request"]["userAttributes"]["phone_number"];
  const email = event["request"]["userAttributes"]["email"];
  const id = event["request"]["userAttributes"]["sub"];

  const dao = new UserProfileDao(db);
  await dao.createUserProfile({
    name: name,
    email: email,
    phone_number: phoneNumber,
    username: userName,
  });

  // Return to Amazon Cognito
  callback(null, event);
};
