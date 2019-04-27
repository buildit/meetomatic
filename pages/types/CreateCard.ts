/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCard
// ====================================================

export interface CreateCard_createCard_card_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface CreateCard_createCard_card_owner {
  __typename: "User";
  name: string;
  id: string;
  email: string;
}

export interface CreateCard_createCard_card {
  __typename: "Card";
  id: string;
  description: string;
  column: CreateCard_createCard_card_column;
  owner: CreateCard_createCard_card_owner;
}

export interface CreateCard_createCard {
  __typename: "CreateCardPayload";
  card: CreateCard_createCard_card;
}

export interface CreateCard {
  createCard: CreateCard_createCard;
}

export interface CreateCardVariables {
  description: string;
  columnId: string;
}
