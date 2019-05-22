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
