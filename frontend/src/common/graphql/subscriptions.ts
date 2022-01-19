/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote($owner: String!) {
    onCreateNote(owner: $owner) {
      note_id
      note_title
      note_body
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote($owner: String!) {
    onUpdateNote(owner: $owner) {
      note_id
      note_title
      note_body
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote($owner: String!) {
    onDeleteNote(owner: $owner) {
      note_id
      note_title
      note_body
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      username
      name
      phone_number
      email
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      username
      name
      phone_number
      email
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      username
      name
      phone_number
      email
      createdAt
      updatedAt
    }
  }
`;
