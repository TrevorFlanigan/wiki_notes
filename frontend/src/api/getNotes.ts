import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API } from "aws-amplify";
// eslint-disable-next-line import/no-unresolved
import { listNotes } from "../common/graphql/queries";
const getAllNotes = async () => {
  const notes = (await API.graphql({
    query: listNotes,
  })) as GraphQLResult<any>;
  if (notes.errors && notes.errors.length > 0) {
    throw notes.errors;
  }

  return notes.data.listNotes.items;
};

export default getAllNotes;
