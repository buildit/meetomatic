import * as jwt from "jsonwebtoken";
import { Prisma, User } from "./generated/prisma-client";

export interface Context {
  prisma: Prisma;
  request: any;
  config: {
    appSecret: String;
  };
  user: User;
}

export async function getUser(ctx: Context): Promise<User> {
  const Authorization = ctx.request.get("Authorization");
  if (Authorization) {
    try {
      const token = Authorization.replace("Bearer ", "");
      if (token) {
        const { userId } = jwt.verify(token, ctx.config.appSecret) as {
          userId: string;
        };
        const user = await ctx.prisma.user({ id: userId });
        return user;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  return null;
}

export class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}
