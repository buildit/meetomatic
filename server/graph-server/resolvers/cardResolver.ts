import { Context } from "../utils";
import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  PubSub,
  Publisher
} from "type-graphql";
import Card, {
  CreateCardInput,
  CreateCardPayload,
  UpdateCardPayload,
  UpdateCardInput,
  UpvoteCardPayload,
  UpvoteCardInput,
  DownvoteCardPayload
} from "../schemas/card";
import User from "../schemas/user";
import Column from "../schemas/column";
import { CardUpdateInput, Prisma } from "../generated/prisma-client";
import { BoardNotification, CardUpdates } from "../schemas/notifications";
import Vote from "../schemas/vote";

@Resolver(() => Card)
export default class {
  async getBoard(cardId, prisma: Prisma) {
    const boards = await prisma.boards({
      where: { columns_some: { cards_some: { id: cardId } } }
    });
    if (!boards.length) {
      throw Error(`Cannot find board for card ${cardId}`);
    }
    return boards[0];
  }

  @Mutation(() => CreateCardPayload)
  async createCard(
    @Arg("input") input: CreateCardInput,
    @Ctx() ctx: Context,
    @PubSub("boardNotification") publish: Publisher<BoardNotification>
  ): Promise<CreateCardPayload> {
    const column = await ctx.prisma
      .column({ id: input.columnId })
      .$fragment<{ id: string; board: { id: string } }>(
        `fragment EnsureBoard on Column { id, board { id }}`
      );
    if (!column) {
      throw Error(`Column ${input.columnId} does not exist`);
    }

    const card = await ctx.prisma.createCard({
      description: input.description,
      column: { connect: { id: input.columnId } },
      owner: { connect: { id: ctx.user.id } },
      archivedOn: null
    });
    await publish({
      updates: [{ card, name: CardUpdates.Created }],
      boardId: column.board.id
    });
    return {
      card
    };
  }

  @Mutation(() => UpdateCardPayload)
  async updateCard(
    @Arg("id") id: string,
    @Arg("input") input: UpdateCardInput,
    @Ctx() ctx: Context,
    @PubSub("boardNotification") publish: Publisher<BoardNotification>
  ): Promise<UpdateCardPayload | any> {
    const card = await ctx.prisma.card({ id });

    if (!card) {
      throw Error(`Card ${id} does not exist`);
    }

    const board = await this.getBoard(id, ctx.prisma);

    const data: CardUpdateInput = {};
    const updates: CardUpdates[] = [];
    if (input.setColumn) {
      const { setColumn } = input;
      const destColumn = await ctx.prisma
        .column({ id: setColumn.columnId })
        .$fragment<{ id: string; board: { id: string } }>(
          `fragment EnsureBoard on Column { id, board { id }}`
        );
      if (!destColumn) {
        throw Error(`Column ${setColumn.columnId} does not exist`);
      }
      if (board.id !== destColumn.board.id) {
        throw Error("Cannot move cards between boards.");
      }
      data.column = { connect: { id: setColumn.columnId } };
      updates.push(CardUpdates.Moved);
    }

    if (input.setDescription) {
      // TODO: validate description
      data.description = input.setDescription.description;
      updates.push(CardUpdates.Renamed);
    }

    if (input.setArchivedOn) {
      data.archivedOn = input.setArchivedOn.archivedOn;
      updates.push(CardUpdates.Renamed);
    }

    const updatedCard = await ctx.prisma.updateCard({
      where: { id },
      data
    });

    await publish({
      updates: updates.map(name => ({ card: updatedCard, name })),
      boardId: board.id
    });

    return {
      card: updatedCard
    };
  }

  @Mutation(() => UpvoteCardPayload)
  async upvoteCard(
    @Arg("input") input: UpvoteCardInput,
    @Ctx() ctx: Context,
    @PubSub("boardNotification") publish: Publisher<BoardNotification>
  ): Promise<UpvoteCardPayload> {
    const card = await ctx.prisma.card({ id: input.cardId });
    
    if (!card) {
      throw Error(`Card ${input.cardId} does not exist`);
    }

    const board = await this.getBoard(input.cardId, ctx.prisma);

    // Get an aggregate count of votes on this board belonging to this user.
    const { count: voteCount } = await ctx.prisma
      .votesConnection({
        where: {
          AND: [
            { owner: { id: ctx.user.id } },
            { card: { column: { board: { id: board.id } } } }
          ]
        }
      })
      .aggregate();

    if (voteCount >= board.maxVotes) {
      throw Error("You have no more vote left on this board");
    }

    const vote = await ctx.prisma.createVote({
      card: { connect: { id: input.cardId } },
      owner: { connect: { id: ctx.user.id } }
    });

    await publish({
      updates: [{ card, vote, name: CardUpdates.Upvoted }],
      boardId: board.id
    });
    return {
      card: { id: card.id, description: card.description },
      vote
    };
  }

  @Mutation(() => DownvoteCardPayload)
  async downvoteCard(
    @Arg("cardId") cardId: string,
    @Ctx() ctx: Context,
    @PubSub("boardNotification") publish: Publisher<BoardNotification>
  ): Promise<DownvoteCardPayload> {
    // Pull all votes for this user on the card and remove the lastest one
    const votes = await ctx.prisma.votes({
      where: {
        AND: [{ card: { id: cardId } }, { owner: { id: ctx.user.id } }]
      },
      orderBy: "createdAt_DESC"
    });

    if (!votes.length) {
      throw Error(`User does not have any votes on card ${cardId}`);
    }

    const card = await ctx.prisma.card({ id: cardId });
    const board = await this.getBoard(cardId, ctx.prisma);
    await ctx.prisma.deleteVote({ id: votes[0].id });

    await publish({
      boardId: board.id,
      updates: [{ card, voteId: votes[0].id, name: CardUpdates.Downvoted }]
    });

    return {
      voteId: votes[0].id,
      card
    };
  }

  @FieldResolver(() => User)
  owner(@Root() card: Card, @Ctx() ctx: Context): Promise<User> {
    return ctx.prisma.card({ id: card.id }).owner();
  }

  @FieldResolver(() => Column)
  column(@Root() card: Card, @Ctx() ctx: Context): Promise<Column> {
    return ctx.prisma.card({ id: card.id }).column();
  }

  @FieldResolver(() => [Vote])
  votes(@Root() card: Card, @Ctx() ctx: Context): Promise<Vote[]> {
    return ctx.prisma.card({ id: card.id }).votes();
  }
}
