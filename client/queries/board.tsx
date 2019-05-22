import gql from "graphql-tag";
import { 
    CARD_FRAGMENT
  } from "../fragments/cardFragments";

export const GET_BOARD = gql`
query Board($id: String!) {
  board(id: $id) {
    id
    remainingVotes @client
    name
    maxVotes
    owner {
      id
      name
      email
    }
    columns {
      id
      name
      cards {
        id
        description
        column {
          id
        }
        owner {
          id
          name
          email
        }
        votes {
          id
          owner {
            id
          }
        }
      }
    }
  }
}
`;

export const BOARD_UPDATED_SUBSCRIPTION = gql`
  subscription BoardUpdated($boardId: String!) {
    boardUpdated(boardId: $boardId) {
      boardId
      updates {
        __typename
        ... on CardCreatedUpdate {
          card {
            ...Card
          }
        }
        __typename
        ... on CardMovedUpdate {
          card {
            ...Card
          }
        }
        __typename
        ... on CardRenamedUpdate {
          card {
            ...Card
          }
        }
      }
    }
  }
  ${CARD_FRAGMENT}
`;