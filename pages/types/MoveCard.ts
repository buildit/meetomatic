/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MoveCard
// ====================================================

export interface MoveCard_updateCard_card_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface MoveCard_updateCard_card_owner {
  __typename: "User";
  id: string;
}

export interface MoveCard_updateCard_card {
  __typename: "Card";
  id: string;
  column: MoveCard_updateCard_card_column;
  owner: MoveCard_updateCard_card_owner;
}

export interface MoveCard_updateCard {
  __typename: "UpdateCardPayload";
  card: MoveCard_updateCard_card;
}

export interface MoveCard {
  updateCard: MoveCard_updateCard;
}

export interface MoveCardVariables {
  id: string;
  columnId: string;
}
