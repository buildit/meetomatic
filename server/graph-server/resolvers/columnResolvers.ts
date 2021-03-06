import { Resolver, Root, FieldResolver, Ctx } from "type-graphql";
import Card from "../schemas/card";
import Column from "../schemas/column";
import { Context } from "../utils";

@Resolver(() => Column)
export default class ColumnResolvers {
  @FieldResolver(() => [Card])
  cards(@Root() column: Column, @Ctx() ctx: Context): Promise<Card[]> {
    return ctx.prisma.column({ id: column.id }).cards();
  }
}
