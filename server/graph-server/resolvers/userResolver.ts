import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Context, getUser } from "../utils";
import { Resolver, Mutation, Ctx, Arg, Query } from "type-graphql";
import User, { AuthPayload, SignUpInput, LoginInput } from "../schemas/user";

@Resolver(() => User)
export default class {
  @Query(() => User, { nullable: true })
  async getCurrentUser(@Ctx() ctx: Context): Promise<User> {
    return await getUser(ctx);
  }

  @Mutation(() => AuthPayload)
  async signup(
    @Arg("input") input: SignUpInput,
    @Ctx() ctx: Context
  ): Promise<AuthPayload> {
    const password = await bcrypt.hash(input.password, 10);
    const existingUsers = await ctx.prisma.users({
      where: { email: input.email }
    });
    if (existingUsers.length) {
      throw new Error("Email is already taken");
    }
    const user = await ctx.prisma.createUser({ ...input, password });

    return {
      token: jwt.sign({ userId: user.id }, ctx.config.appSecret),
      user
    };
  }

  @Mutation(() => AuthPayload)
  async login(
    @Arg("input") { email, password }: LoginInput,
    @Ctx() ctx: Context
  ): Promise<AuthPayload> {
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
}
