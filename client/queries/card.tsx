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
  mutation updateCard($cardId: String!, $date: String!) {
    updateCard(input: { archivedOn: $date }, id: $cardId) {
      card {
        ...Card
      }
    }
  }
  ${CARD_FRAGMENT}
`;



