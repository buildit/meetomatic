import {
  Resolver,
  Query,
  Arg,
  Root,
  FieldResolver,
  Ctx,
  Mutation
} from "type-graphql";
import Board, { CreateBoardInput } from "../schemas/board";
import Column from "../schemas/column";
import { Context } from "../utils";

@Resolver(() => Board)
export default class BoardResolvers {
  @Query(() => [Board])
  async boards(@Ctx() ctx: Context): Promise<Board[]> {
    return await ctx.prisma.boards();
  }
  @Query(() => Board, { nullable: true })
  async board(@Arg("id") id: string): Promise<Board> {
    return {
      id: id,
      name: `My First Board - ${id}`
    };
  }

  @Mutation(() => Board)
  async createBoard(
    @Arg("input") input: CreateBoardInput,
    @Ctx() ctx: Context
  ): Promise<Board> {
    const board = await ctx.prisma.createBoard({ ...input });
    return board;
  }

  @FieldResolver()
  async columns(@Root() _board: Board): Promise<Column[]> {
    return [
      { id: "123", name: "Not Started" },
      { id: "456", name: "In Progress" },
      { id: "789", name: "Done" },
      { id: "101112", name: "Done Done" }
    ];
  }
}
