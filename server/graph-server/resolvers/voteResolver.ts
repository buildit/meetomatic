import { Resolver, Root, FieldResolver, Ctx } from "type-graphql";
import { Context } from "../utils";
import Vote from "../schemas/vote";
import User from "../schemas/user";
import Card from "../schemas/card";

@Resolver(() => Vote)
export default class VoteResolvers {
  @FieldResolver(() => User)
  owner(@Root() vote: Vote, @Ctx() ctx: Context): Promise<User> {
    return ctx.prisma.vote({ id: vote.id }).owner();
  }

  @FieldResolver(() => Card)
  card(@Root() vote: Vote, @Ctx() ctx: Context): Promise<Card> {
    return ctx.prisma.vote({ id: vote.id }).card();
  }
}
