import { ObjectType, Field, InputType } from "type-graphql";
import User from "./user";
import Column from "./column";

@ObjectType()
export default class Card {
  @Field()
  id: string;

  @Field()
  description: string;

  @Field()
  column?: Column;

  @Field()
  owner?: User;
}

@InputType()
export class CreateCardInput {
  @Field()
  description: string;

  @Field()
  columnId: string;
}

@ObjectType()
export class CreateCardPayload {
  @Field()
  card: Card;
}
