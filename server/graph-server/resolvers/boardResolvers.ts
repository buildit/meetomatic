import { Resolver, Query, Arg, Root, FieldResolver } from "type-graphql";
import Board from "../schemas/board";
import Column from "../schemas/column";

@Resolver(() => Board)
export default class BoardResolvers {
  @Query(() => Board, { nullable: true })
  async board(@Arg("id") id: string): Promise<Board> {
    return {
      id: id,
      name: "My First Board"
    };
  }

  @FieldResolver()
  async columns(@Root() _board: Board): Promise<Column[]> {
    return [
      { id: "123", name: "Not Started" },
      { id: "456", name: "In Progress" },
      { id: "789", name: "Done" }
    ];
  }
}
