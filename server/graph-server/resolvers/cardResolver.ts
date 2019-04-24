import { Context } from "../utils";
import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import Card, { CreateCardInput } from "../schemas/card";

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
    // Prisma is a bit quirky in how it works with relations.  We need to fetch it separately
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

  @Query(() => Card)
  getCard() {
    return null;
  }
}
