/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCard
// ====================================================

export interface CreateCard_createCard_owner {
  __typename: "User";
  name: string;
  id: string;
  email: string;
}

export interface CreateCard_createCard {
  __typename: "Card";
  id: string;
  description: string;
  column: string;
  owner: CreateCard_createCard_owner | null;
}

export interface CreateCard {
  createCard: CreateCard_createCard;
}

export interface CreateCardVariables {
  description: string;
  column: string;
}
