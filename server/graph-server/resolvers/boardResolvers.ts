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
import User from "../schemas/user";

@Resolver(() => Board)
export default class BoardResolvers {
  @Query(() => [Board])
  async boards(@Ctx() ctx: Context): Promise<Board[]> {
    return await ctx.prisma.boards({ where: { owner: { id: ctx.user.id } } });
  }

  @Query(() => Board, { nullable: true })
  async board(@Arg("id") id: string, @Ctx() ctx: Context): Promise<Board> {
    return await ctx.prisma.board({ id: id });
  }

  @Mutation(() => Board)
  async createBoard(
    @Arg("input") input: CreateBoardInput,
    @Ctx() ctx: Context
  ): Promise<Board> {
    const board = await ctx.prisma.createBoard({
      ...input,
      owner: { connect: { id: ctx.user.id } }
    });
    return board;
  }

  @FieldResolver()
  owner(@Root() board: Board, @Ctx() ctx: Context): Promise<User> {
    return ctx.prisma.board({ id: board.id }).owner();
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
