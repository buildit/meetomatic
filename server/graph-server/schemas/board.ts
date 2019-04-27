import { ObjectType, Field, InputType } from "type-graphql";
import Column, { CreateColumnInput } from "./column";
import User from "./user";

@ObjectType()
export default class Board {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [Column], { nullable: true })
  columns?: Column[];

  @Field(() => User)
  owner?: User;
}

@InputType()
export class CreateBoardInput {
  @Field()
  name: string;

  @Field()
  password: string;

  @Field(() => [CreateColumnInput])
  columns?: CreateColumnInput[];
}

@ObjectType()
export class CreateBoardPayload {
  @Field()
  board: Board;
}
