import gql from "graphql-tag";

const CARD_FRAGMENT = gql`
  fragment Card on Card {
    id
    description
    column {
      id
      name
    }
    owner {
      name
      id
      email
    }
    votes {
      id
      owner {
        id
      }
    }
  }
`;

const CARD_UPDATE_FRAGMENT = gql`
  fragment CardUpdate on Card {
    id
    column {
      id
      name
    }
    owner {
      id
    }
  }
`;

const MOVE_CARD = gql`
  mutation MoveCard($id: String!, $columnId: String!) {
    updateCard(id: $id, input: { setColumn: { columnId: $columnId } }) {
      card {
        ...CardUpdate
      }
    }
  }
  ${CARD_UPDATE_FRAGMENT}
`;


const RENAME_CARD = gql`
  mutation RenameCard($id: String!, $description: String!) {
    updateCard(
      id: $id
      input: { setDescription: { description: $description } }
    ) {
      card {
        description
        ...CardUpdate
      }
    }
  }
  ${CARD_UPDATE_FRAGMENT}
`;

export {
    MOVE_CARD,
    RENAME_CARD,
    CARD_UPDATE_FRAGMENT,
    CARD_FRAGMENT
}