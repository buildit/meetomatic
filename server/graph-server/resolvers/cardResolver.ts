import { Context } from "../utils";
import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root
} from "type-graphql";
import Card, { CreateCardInput } from "../schemas/card";
import User from "../schemas/user";

@Resolver(() => Card)
export default class {
  @Mutation(() => Card)
  async createCard(
    @Arg("input") input: CreateCardInput,
    @Ctx() ctx: Context
  ): Promise<Card> {
    const card = ctx.prisma.createCard({
      description: input.description,
      column: input.column,
      owner: { connect: { id: ctx.user.id } }
    });

    const newCard = await card;
    const owner = await ctx.prisma.card({ id: newCard.id }).owner();

    return {
      id: newCard.id,
      description: newCard.description,
      column: newCard.column,
      owner: {
        name: owner.name,
        email: owner.email,
        id: owner.id
      }
    };
  }

  @FieldResolver(() => User)
  async owner(@Root() card: Card, @Ctx() ctx: Context) {
    return await ctx.prisma.card({ id: card.id }).owner();
  }
}
