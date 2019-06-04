import * as jwt from "jsonwebtoken";
import { Prisma, User } from "./generated/prisma-client";
import { PubSub } from "apollo-server";

export interface Context {
  prisma: Prisma;
  req: any;
  config: {
    appSecret: String;
  };
  user: User;
  pubsub: PubSub;
}

export async function getSystemUser(ctx: Context): Promise<User> {
  return await ctx.prisma.user({ id: "cjuygqsd40ce40812ot28cdbd" });
}
export async function getUser(ctx: Context): Promise<User> {
  const Authorization = ctx.req.get("Authorization");
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
