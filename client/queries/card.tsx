import gql from "graphql-tag";
import { 
    CARD_FRAGMENT
  } from "../fragments/cardFragments";
  
export const CREATE_CARD = gql`
  mutation CreateCard($description: String!, $columnId: String!) {
    createCard(input: { description: $description, columnId: $columnId }) {
      card {
        ...Card
      }
    }
  }
  ${CARD_FRAGMENT}
`;

export const UPDATE_CARD_STATUS = gql`
  mutation CreateCard($status: String!) {
    updateCard(input: { status: $status }) {
      card {
        ...Card
      }
    }
  }
  ${CARD_FRAGMENT}
`;


export const DELETE_CARD = gql`
  mutation updateCard($id: String!, $date: String!) {
    updateCard(input: { setArchivedOn : {archivedOn: $date }
      }, 
      id: $id
    ) {
      card {
        ...Card
      }
    }
  }
  ${CARD_FRAGMENT}
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

