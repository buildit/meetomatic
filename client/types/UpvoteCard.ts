/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpvoteCard
// ====================================================

export interface UpvoteCard_upvoteCard_card {
  __typename: "Card";
  id: string;
}

export interface UpvoteCard_upvoteCard_vote_owner {
  __typename: "User";
  id: string;
  email: string;
  name: string;
}

export interface UpvoteCard_upvoteCard_vote {
  __typename: "Vote";
  id: string;
  owner: UpvoteCard_upvoteCard_vote_owner;
}

export interface UpvoteCard_upvoteCard {
  __typename: "UpvoteCardPayload";
  card: UpvoteCard_upvoteCard_card;
  vote: UpvoteCard_upvoteCard_vote;
}

export interface UpvoteCard {
  upvoteCard: UpvoteCard_upvoteCard;
}

export interface UpvoteCardVariables {
  cardId: string;
}
