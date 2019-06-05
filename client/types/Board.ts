/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Board
// ====================================================

export interface Board_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Board_columns_cards_column {
  __typename: "Column";
  id: string;
}

export interface Board_columns_cards_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Board_columns_cards_votes_owner {
  __typename: "User";
  id: string;
}

export interface Board_columns_cards_votes {
  __typename: "Vote";
  id: string;
  owner: Board_columns_cards_votes_owner;
}

export interface Board_columns_cards {
  __typename: "Card";
  id: string;
  description: string;
  column: Board_columns_cards_column;
  owner: Board_columns_cards_owner;
  votes: Board_columns_cards_votes[] | null;
}

export interface Board_columns {
  __typename: "Column";
  id: string;
  name: string;
  cards: Board_columns_cards[] | null;
}

export interface Board {
  __typename: "Board";
  id: string;
  remainingVotes: number;
  name: string;
  maxVotes: number;
  owner: Board_owner;
  columns: Board_columns[] | null;
}

export interface Board {
  board: Board | null;
}

export interface BoardVariables {
  id: string;
}
