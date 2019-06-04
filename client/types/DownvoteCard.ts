/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DownvoteCard
// ====================================================

export interface DownvoteCard_downvoteCard_card {
  __typename: "Card";
  id: string;
}

export interface DownvoteCard_downvoteCard {
  __typename: "DownvoteCardPayload";
  card: DownvoteCard_downvoteCard_card;
  voteId: string;
}

export interface DownvoteCard {
  downvoteCard: DownvoteCard_downvoteCard;
}

export interface DownvoteCardVariables {
  cardId: string;
}
