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
  UpdateCardInput
} from "../schemas/card";
import User from "../schemas/user";
import Column from "../schemas/column";
import { CardUpdateInput } from "../generated/prisma-client";
import { BoardNotification, CardUpdates } from "../schemas/notifications";
import Vote from "../schemas/vote";

@Resolver(() => Card)
export default class {
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
      owner: { connect: { id: ctx.user.id } }
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
    const card = await ctx.prisma
      .card({ id })
      .$fragment<{ id: string; column: { id: string; board: { id: string } } }>(
        `fragment EnsureColumn on Card { id, column { id, name, board { id, name } }}`
      );

    if (!card) {
      throw Error(`Card ${id} does not exist`);
    }

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
      if (card.column.board.id !== destColumn.board.id) {
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

    const updatedCard = await ctx.prisma.updateCard({
      where: { id },
      data
    });

    await publish({
      updates: updates.map(name => ({ card: updatedCard, name })),
      boardId: card.column.board.id
    });

    return {
      card: updatedCard
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
