import { Context } from "../../utils";

export default {
  async createCard(_, { input: { description, column } }, ctx: Context) {
    const card = ctx.prisma.createCard({
      description,
      column,
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
        id: owner.id,
        name: owner.name,
        email: owner.email
      }
    };
  }
};
