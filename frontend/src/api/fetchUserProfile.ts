import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API } from "aws-amplify";
import { GetUserInput } from "../types/UserType";
import { getUser } from "../common/graphql/queries";
// eslint-disable-next-line import/no-unresolved
const fetchUser = async ({ username }: GetUserInput) => {
  const user = (await API.graphql({
    query: getUser,
    variables: {
      input: {
        username,
      },
    },
  })) as GraphQLResult<any>;
  if (user.errors && user.errors.length > 0) {
    throw user.errors;
  }

  return user.data.getUser;
};

export default fetchUser;
