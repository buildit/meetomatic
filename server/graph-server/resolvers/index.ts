import { auth } from "./Mutation/auth";
import user from "./query/user";

export default {
  Mutation: {
    ...auth
  },
  Query: {
    ...user
  }
};
