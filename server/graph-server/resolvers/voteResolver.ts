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
import { BoardNotification } from "../schemas/notifications";

@Resolver(() => Vote)
export default class VoteResolvers {
  @Mutation(() => CreateVotePayload)
  async createCard(
    @Arg("input") input: CreateVoteInput,
    @Ctx() ctx: Context,
    @PubSub("boardNotification") _publish: Publisher<BoardNotification>
  ): Promise<CreateVotePayload> {
    /*
      Todo:
      - Pull the number of allowed votes from the board setting (these don't exist )
      - Pull the number of votes on this board for the current user
      - Validate the user has enough remaining votes
      - Send a subscription notification
    */
    const card = await ctx.prisma.card({ id: input.cardId });
    if (!card) {
      throw Error(`Card ${input.cardId} does not exist`);
    }

    const vote = await ctx.prisma.createVote({
      card: { connect: { id: input.cardId } },
      owner: { connect: { id: ctx.user.id } },
      upVote: input.upVote
    });
    // await publish({
    //   updates: [{ vote, cardId: input.cardId, name: CardUpdates.VoteCreated }],
    //   boardId: column.board.id
    // });
    return {
      vote
    };
  }

  @FieldResolver(() => User)
  owner(@Root() vote: Vote, @Ctx() ctx: Context): Promise<User> {
    return ctx.prisma.vote({ id: vote.id }).owner();
  }
}
