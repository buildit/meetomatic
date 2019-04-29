import { Context } from "../utils";
import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root
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

@Resolver(() => Card)
export default class {
  @Mutation(() => CreateCardPayload)
  async createCard(
    @Arg("input") input: CreateCardInput,
    @Ctx() ctx: Context
  ): Promise<CreateCardPayload> {
    const card = await ctx.prisma.createCard({
      description: input.description,
      column: { connect: { id: input.columnId } },
      owner: { connect: { id: ctx.user.id } }
    });
    return {
      card
    };
  }

  @Mutation(() => UpdateCardPayload)
  async updateCard(
    @Arg("id") id: string,
    @Arg("input") input: UpdateCardInput,
    @Ctx() ctx: Context
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
    }

    if (input.setDescription) {
      // TODO: validate description
      data.description = input.setDescription.description;
    }
    const updatedCard = await ctx.prisma.updateCard({
      where: { id },
      data
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
}
