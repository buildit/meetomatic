/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Board
// ====================================================

export interface Board_board_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Board_board_columns_cards_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface Board_board_columns_cards_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Board_board_columns_cards {
  __typename: "Card";
  id: string;
  description: string;
  column: Board_board_columns_cards_column;
  owner: Board_board_columns_cards_owner;
}

export interface Board_board_columns {
  __typename: "Column";
  id: string;
  name: string;
  cards: Board_board_columns_cards[] | null;
}

export interface Board_board {
  __typename: "Board";
  id: string;
  name: string;
  owner: Board_board_owner;
  columns: Board_board_columns[] | null;
}

export interface Board {
  board: Board_board | null;
}

export interface BoardVariables {
  id: string;
}
