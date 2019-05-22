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
import Vote, {
  CreateVotePayload,
  CreateVoteInput,
  DeleteVotePayload
} from "../schemas/vote";
import User from "../schemas/user";
import { BoardNotification, CardUpdates } from "../schemas/notifications";
import { Prisma } from "../generated/prisma-client";
import Card from "../schemas/card";

@Resolver(() => Vote)
export default class VoteResolvers {
  getCard(id: string, prisma: Prisma) {
    return prisma.card({ id }).$fragment<{
      id: string;
      column: { id: string; board: { id: string; maxVotes: number } };
    }>(`fragment EnsureColumn on Card { id, column { id, name, board { id, maxVotes } }}`);
  }

  @Mutation(() => CreateVotePayload)
  async createVote(
    @Arg("input") input: CreateVoteInput,
    @Ctx() ctx: Context,
    @PubSub("boardNotification") publish: Publisher<BoardNotification>
  ): Promise<CreateVotePayload> {
    const card = await this.getCard(input.cardId, ctx.prisma);
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

  @Mutation(() => DeleteVotePayload)
  async deleteVote(
    @Arg("id") id: string,
    @Ctx() ctx: Context,
    @PubSub("boardNotification") publish: Publisher<BoardNotification>
  ): Promise<DeleteVotePayload> {
    const votes = await ctx.prisma.votes({
      where: { AND: [{ id }, { owner: { id: ctx.user.id } }] }
    });

    if (!votes.length) {
      throw Error(`Vote ${id} does not exist or does not belong to this user`);
    }
    const card = await ctx.prisma.vote({ id }).card();
    const board = await ctx.prisma
      .vote({ id })
      .card()
      .column()
      .board();
    await ctx.prisma.deleteVote({ id });
    await publish({
      boardId: board.id,
      updates: [{ id, cardId: card.id, name: CardUpdates.VoteDeleted }]
    });
    return {
      id,
      cardId: card.id
    };
  }

  @FieldResolver(() => User)
  owner(@Root() vote: Vote, @Ctx() ctx: Context): Promise<User> {
    return ctx.prisma.vote({ id: vote.id }).owner();
  }

  @FieldResolver(() => Card)
  card(@Root() vote: Vote, @Ctx() ctx: Context): Promise<Card> {
    return ctx.prisma.vote({ id: vote.id }).card();
  }
}
