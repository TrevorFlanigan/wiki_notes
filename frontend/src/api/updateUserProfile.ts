import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API } from "aws-amplify";
import { UpdateUserInput } from "../types/UserType";
import { updateUser } from "../common/graphql/mutations";

const updateUserProfile = async ({
  username,
  email,
  name,
  phone_number,
}: UpdateUserInput) => {
  const user = (await API.graphql({
    query: updateUser,
    variables: {
      input: {
        username,
        email,
        name,
        phone_number,
      },
    },
  })) as GraphQLResult<any>;
  if (user.errors && user.errors.length > 0) {
    throw user.errors;
  }

  return user.data.updateUser;
};

export default updateUserProfile;
