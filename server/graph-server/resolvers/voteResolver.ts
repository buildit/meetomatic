import {
  Resolver,
  Root,
  FieldResolver,
  Ctx,
  Mutation,
  PubSub,
  Publisher,
  Arg
} from "type-graphql";
import { Context } from "../utils";
import Vote, { CreateVotePayload, CreateVoteInput } from "../schemas/vote";
import User from "../schemas/user";
import { BoardNotification, CardUpdates } from "../schemas/notifications";

@Resolver(() => Vote)
export default class VoteResolvers {
  @Mutation(() => CreateVotePayload)
  async createVote(
    @Arg("input") input: CreateVoteInput,
    @Ctx() ctx: Context,
    @PubSub("boardNotification") publish: Publisher<BoardNotification>
  ): Promise<CreateVotePayload> {
    const card = await ctx.prisma.card({ id: input.cardId }).$fragment<{
      id: string;
      column: { id: string; board: { id: string; maxVotes: number } };
    }>(`fragment EnsureColumn on Card { id, column { id, name, board { id, maxVotes } }}`);
    if (!card) {
      throw Error(`Card ${input.cardId} does not exist`);
    }

    // Get an aggregate count of votes on this board belonging to this user.
    const { count: voteCount } = await ctx.prisma
      .votesConnection({
        where: {
          AND: [
            { owner: { id: ctx.user.id } },
            { card: { column: { board: { id: card.column.board.id } } } }
          ]
        }
      })
      .aggregate();
    if (voteCount >= card.column.board.maxVotes) {
      throw Error("You have no more vote left on this board");
    }

    const vote = await ctx.prisma.createVote({
      card: { connect: { id: input.cardId } },
      owner: { connect: { id: ctx.user.id } },
      upvote: input.upvote
    });
    await publish({
      updates: [{ vote, name: CardUpdates.Upvoted }],
      boardId: card.column.board.id
    });
    return {
      vote
    };
  }

  @FieldResolver(() => User)
  owner(@Root() vote: Vote, @Ctx() ctx: Context): Promise<User> {
    return ctx.prisma.vote({ id: vote.id }).owner();
  }
}
