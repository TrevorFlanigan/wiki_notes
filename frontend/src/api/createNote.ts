import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API } from "aws-amplify";
import { createNote } from "../common/graphql/mutations";
import id from "./id";

export type CreateNoteInput = {
  title: string;
  body?: string;
};

const makeNote = async ({ title, body = "" }: CreateNoteInput) => {
  const notes = (await API.graphql({
    query: createNote,
    variables: {
      input: {
        note_id: id(),
        note_title: title,
        note_body: body,
      },
    },
  })) as GraphQLResult<any>;
  if (notes.errors && notes.errors.length > 0) {
    throw notes.errors;
  }

  return notes.data.createNote;
};

export default makeNote;
