/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: CardCreated
// ====================================================

export interface CardCreated_cardCreated_card_column {
  __typename: "Column";
  id: string;
  name: string;
}

export interface CardCreated_cardCreated_card_owner {
  __typename: "User";
  name: string;
  id: string;
  email: string;
}

export interface CardCreated_cardCreated_card {
  __typename: "Card";
  id: string;
  description: string;
  column: CardCreated_cardCreated_card_column;
  owner: CardCreated_cardCreated_card_owner;
}

export interface CardCreated_cardCreated {
  __typename: "CardCreatedNotification";
  card: CardCreated_cardCreated_card;
  boardId: string;
}

export interface CardCreated {
  cardCreated: CardCreated_cardCreated;
}

export interface CardCreatedVariables {
  boardId: string;
}
