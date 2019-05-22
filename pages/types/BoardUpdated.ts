/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: BoardUpdated
// ====================================================

export interface BoardUpdated_boardUpdated_updates_CardUpvotedUpdate {
  __typename: "CardUpvotedUpdate" | "CardVoteDeletedUpdate";
}

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

export interface BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_votes_owner {
  __typename: "User";
  id: string;
}

export interface BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_votes {
  __typename: "Vote";
  id: string;
  owner: BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_votes_owner;
}

export interface BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card {
  __typename: "Card";
  id: string;
  description: string;
  column: BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_column;
  owner: BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_owner;
  votes: BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card_votes[] | null;
}

export interface BoardUpdated_boardUpdated_updates_CardCreatedUpdate {
  __typename: "CardCreatedUpdate";
  card: BoardUpdated_boardUpdated_updates_CardCreatedUpdate_card;
}

export interface BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_owner {
  __typename: "User";
  name: string;
  id: string;
  email: string;
}

export interface BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_votes_owner {
  __typename: "User";
  id: string;
}

export interface BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_votes {
  __typename: "Vote";
  id: string;
  owner: BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_votes_owner;
}

export interface BoardUpdated_boardUpdated_updates_CardMovedUpdate_card {
  __typename: "Card";
  id: string;
  description: string;
  column: BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_column;
  owner: BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_owner;
  votes: BoardUpdated_boardUpdated_updates_CardMovedUpdate_card_votes[] | null;
}

export interface BoardUpdated_boardUpdated_updates_CardMovedUpdate {
  __typename: "CardMovedUpdate";
  card: BoardUpdated_boardUpdated_updates_CardMovedUpdate_card;
}

export interface BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card_owner {
  __typename: "User";
  name: string;
  id: string;
  email: string;
}

export interface BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card_votes_owner {
  __typename: "User";
  id: string;
}

export interface BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card_votes {
  __typename: "Vote";
  id: string;
  owner: BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card_votes_owner;
}

export interface BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card {
  __typename: "Card";
  id: string;
  description: string;
  column: BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card_column;
  owner: BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card_owner;
  votes: BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card_votes[] | null;
}

export interface BoardUpdated_boardUpdated_updates_CardRenamedUpdate {
  __typename: "CardRenamedUpdate";
  card: BoardUpdated_boardUpdated_updates_CardRenamedUpdate_card;
}

export type BoardUpdated_boardUpdated_updates = BoardUpdated_boardUpdated_updates_CardUpvotedUpdate | BoardUpdated_boardUpdated_updates_CardCreatedUpdate | BoardUpdated_boardUpdated_updates_CardMovedUpdate | BoardUpdated_boardUpdated_updates_CardRenamedUpdate;

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
