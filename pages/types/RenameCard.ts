/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RenameCard
// ====================================================

export interface RenameCard_updateCard_card_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface RenameCard_updateCard_card_owner {
  __typename: "User";
  id: string;
}

export interface RenameCard_updateCard_card {
  __typename: "Card";
  description: string;
  id: string;
  column: RenameCard_updateCard_card_column;
  owner: RenameCard_updateCard_card_owner;
}

export interface RenameCard_updateCard {
  __typename: "UpdateCardPayload";
  card: RenameCard_updateCard_card;
}

export interface RenameCard {
  updateCard: RenameCard_updateCard;
}

export interface RenameCardVariables {
  id: string;
  description: string;
}
