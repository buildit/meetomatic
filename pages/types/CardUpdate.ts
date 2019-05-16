/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CardUpdate
// ====================================================

export interface CardUpdate_column {
  __typename: "Column";
  id: string;
}

export interface CardUpdate_owner {
  __typename: "User";
  id: string;
}

export interface CardUpdate {
  __typename: "Card";
  id: string;
  column: CardUpdate_column;
  owner: CardUpdate_owner;
}
