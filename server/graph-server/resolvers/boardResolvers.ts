import {
  Resolver,
  Query,
  Arg,
  Root,
  FieldResolver,
  Ctx,
  Mutation,
  Subscription
} from "type-graphql";
import Board, { CreateBoardInput, CreateBoardPayload } from "../schemas/board";
import Column from "../schemas/column";
import { Context } from "../utils";
import User from "../schemas/user";
import { BoardNotification } from "../schemas/notifications";

@Resolver(() => Board)
export default class BoardResolvers {
  @Query(() => [Board])
  boards(@Ctx() ctx: Context): Promise<Board[]> {
    return ctx.prisma.boards({ where: { owner: { id: ctx.user.id } } });
  }

  @Query(() => Board, { nullable: true })
  board(@Arg("id") id: string, @Ctx() ctx: Context): Promise<Board> {
    return ctx.prisma.board({ id: id });
  }

  @Mutation(() => CreateBoardPayload)
  async createBoard(
    @Arg("input") input: CreateBoardInput,
    @Ctx() ctx: Context
  ): Promise<CreateBoardPayload> {
    const board = await ctx.prisma.createBoard({
      name: input.name,
      password: input.password,
      owner: { connect: { id: ctx.user.id } },
      columns: {
        create: input.columns.map(c => ({
          name: c.name,
          owner: { connect: { id: ctx.user.id } }
        }))
      }
    });
    return { board };
  }

  @FieldResolver()
  owner(@Root() board: Board, @Ctx() ctx: Context): Promise<User> {
    return ctx.prisma.board({ id: board.id }).owner();
  }

  @FieldResolver()
  async columns(@Root() board: Board, @Ctx() ctx: Context): Promise<Column[]> {
    return await ctx.prisma.board({ id: board.id }).columns();
  }

  @Subscription(() => BoardNotification, {
    topics: "boardNotification",
    filter({ args, payload }) {
      return args.boardId === payload.boardId;
    }
  })
  boardUpdated(
    @Root() boardNotification: BoardNotification,
    @Arg("boardId") boardId: string
  ): BoardNotification {
    return {
      ...boardNotification,
      boardId
    };
  }
}
