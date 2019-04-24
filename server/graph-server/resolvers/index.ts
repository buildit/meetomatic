import { auth } from "./Mutation/auth";
import user from "./query/user";
import cardMutations from "./Mutation/cards";

export default {
  Mutation: {
    ...auth,
    ...cardMutations
  },
  Query: {
    ...user
  }
};
