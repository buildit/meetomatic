import gql from "graphql-tag";

export const typeDefs = gql`
  extend type Board {
    remainingVotes: Int!
  }
`;

export const GET_USER = gql`
  query CurrentUser {
    currentUser {
      id
      email
      name
    }
  }
`;


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

export const UPVOTE_CARD = gql`
  mutation UpvoteCard($cardId: String!) {
    upvoteCard(input: { cardId: $cardId }) {
      card {
        id
      }
      vote {
        id
        owner {
          id
          email
          name
        }
      }
    }
  }
`;

export const DOWNVOTE_CARD = gql`
  mutation DownvoteCard($cardId: String!) {
    downvoteCard(cardId: $cardId) {
      card {
        id
      }
      voteId
    }
  }
`;
