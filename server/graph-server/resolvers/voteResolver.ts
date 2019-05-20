import { Resolver, Root, FieldResolver, Ctx } from "type-graphql";
import { Context } from "../utils";
import Vote from "../schemas/vote";
import User from "../schemas/user";

@Resolver(() => Vote)
export default class VoteResolvers {
  @FieldResolver(() => User)
  owner(@Root() vote: Vote, @Ctx() ctx: Context): Promise<User> {
    return ctx.prisma.vote({ id: vote.id }).owner();
  }
}
