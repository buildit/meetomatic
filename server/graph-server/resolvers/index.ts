import { auth } from "./Mutation/auth";
import { board } from "./Mutation/board"
import user from "./query/user";

export default {
  Mutation: {
    ...auth,
    ...board
  },
  Query: {
    ...user
  }
};
