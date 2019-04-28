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
class CardPayload {
  @Field()
  card: Card;
}

@ObjectType()
export class CreateCardPayload extends CardPayload {}

@InputType()
export class SetCardColumnInput {
  @Field()
  columnId: string;
}

@InputType()
export class UpdateCardInput {
  @Field({ nullable: true })
  setColumn?: SetCardColumnInput;
}

@ObjectType()
export class UpdateCardPayload extends CardPayload {}
