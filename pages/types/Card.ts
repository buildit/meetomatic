/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Card
// ====================================================

export interface Card_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface Card_owner {
  __typename: "User";
  name: string;
  id: string;
  email: string;
}

export interface Card {
  __typename: "Card";
  id: string;
  description: string;
  column: Card_column;
  owner: Card_owner;
}
