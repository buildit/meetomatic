import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Context } from "../../utils";

export const auth = {
  async signup(_, args, ctx: Context) {
    const password = await bcrypt.hash(args.password, 10);
    const existingUsers = await ctx.prisma.users({
      where: { email: args.email }
    });
    if (existingUsers.length) {
      throw new Error("Email is already taken");
    }
    const user = await ctx.prisma.createUser({ ...args, password });

    return {
      token: jwt.sign({ userId: user.id }, ctx.config.appSecret),
      user
    };
  },

  async login(_, { email, password }, ctx: Context) {
    const users = await ctx.prisma.users({ where: { email } });

    if (!users.length) {
      throw new Error(`No such user found for email: ${email}`);
    }
    const user = users[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid  password");
    }

    return {
      token: jwt.sign({ userId: user.id }, ctx.config.appSecret),
      user
    };
  }
};
