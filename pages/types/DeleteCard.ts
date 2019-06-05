/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCard
// ====================================================

export interface DeleteCard_createCard_card_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface DeleteCard_createCard_card {
  __typename: "Card";
  id: string;
  description: string;
  column: DeleteCard_createCard_card_column;
}

export interface DeleteCard_createCard {
  __typename: "CreateCardPayload";
  card: DeleteCard_createCard_card;
}

export interface DeleteCard {
  createCard: DeleteCard;
}

export interface DeleteCardVariables {
  date: string;
  id: string;
}
