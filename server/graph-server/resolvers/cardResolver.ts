import { Context } from "../utils";
import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root
} from "type-graphql";
import Card, { CreateCardInput, CreateCardPayload } from "../schemas/card";
import User from "../schemas/user";
import Column from "../schemas/column";

@Resolver(() => Card)
export default class {
  @Mutation(() => CreateCardPayload)
  async createCard(
    @Arg("input") input: CreateCardInput,
    @Ctx() ctx: Context
  ): Promise<CreateCardPayload> {
    const card = ctx.prisma.createCard({
      description: input.description,
      column: { connect: { id: input.columnId } },
      owner: { connect: { id: ctx.user.id } }
    });

    const newCard = await card;
    const owner = await ctx.prisma.card({ id: newCard.id }).owner();

    return {
      card: {
        id: newCard.id,
        description: newCard.description,
        // column: newCard.column,
        owner: {
          name: owner.name,
          email: owner.email,
          id: owner.id
        }
      }
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
