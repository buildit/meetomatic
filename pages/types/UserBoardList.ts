/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserBoardList
// ====================================================

export interface UserBoardList_boards_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface UserBoardList_boards {
  __typename: "Board";
  id: string;
  name: string;
  owner: UserBoardList_boards_owner;
}

export interface UserBoardList {
  boards: UserBoardList_boards[];
}
