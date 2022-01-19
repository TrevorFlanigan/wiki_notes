/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNote = /* GraphQL */ `
  query GetNote($note_id: ID!) {
    getNote(note_id: $note_id) {
      note_id
      note_title
      note_body
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $note_id: ID
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listNotes(
      note_id: $note_id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        note_id
        note_title
        note_body
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($username: String!) {
    getUser(username: $username) {
      username
      name
      phone_number
      email
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $username: String
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      username: $username
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        username
        name
        phone_number
        email
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
