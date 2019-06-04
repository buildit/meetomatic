/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateBoard
// ====================================================

export interface CreateBoard_createBoard_board {
  __typename: "Board";
  id: string;
}

export interface CreateBoard_createBoard {
  __typename: "CreateBoardPayload";
  board: CreateBoard_createBoard_board;
}

export interface CreateBoard {
  createBoard: CreateBoard_createBoard;
}

export interface CreateBoardVariables {
  name: string;
  password: string;
}
