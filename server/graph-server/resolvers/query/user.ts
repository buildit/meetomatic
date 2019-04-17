import { Context, getUser } from "../../utils";

export default {
  async getCurrentUser(_, {}, ctx: Context) {
    return await getUser(ctx);
  }
};
