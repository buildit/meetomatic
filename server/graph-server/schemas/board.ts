import { ObjectType, Field, InputType } from "type-graphql";
import Column from "./column";

@ObjectType()
export default class Board {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [Column], { nullable: true })
  columns?: Column[];

  @Field()
  password: string;
}

@InputType()
export class CreateBoardInput {
  @Field()
  name: string;

  @Field()
  password: string;
}
