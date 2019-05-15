/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: BoardUpdated
// ====================================================

export interface BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_owner {
  __typename: "User";
  name: string;
  id: string;
  email: string;
}

export interface BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card {
  __typename: "Card";
  id: string;
  description: string;
  column: BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_column;
  owner: BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_owner;
}

export interface BoardUpdated_boardUpdated_updates_CardCreatedUpdate {
  __typename: "CardCreatedUpdate";
  card: BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card;
}

export interface BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_column {
  __typename: "Column";
  id: string;
}

export interface BoardUpdated_boardUpdated_updates_CardMovedUpdate_card {
  __typename: "Card";
  id: string;
  column: BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_column;
}

export interface BoardUpdated_boardUpdated_updates_CardMovedUpdate {
  __typename: "CardMovedUpdate";
  card: BoardUpdated_boardUpdated_updates_CardMovedUpdate_card;
}

export type BoardUpdated_boardUpdated_updates =
  | BoardUpdated_boardUpdated_updates_CardCreatedUpdate
  | BoardUpdated_boardUpdated_updates_CardMovedUpdate;

export interface BoardUpdated_boardUpdated {
  __typename: "BoardNotification";
  boardId: string;
  updates: BoardUpdated_boardUpdated_updates[];
}

export interface BoardUpdated {
  boardUpdated: BoardUpdated_boardUpdated;
}

export interface BoardUpdatedVariables {
  boardId: string;
}
