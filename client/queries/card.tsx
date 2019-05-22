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
