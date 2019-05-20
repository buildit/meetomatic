import { ObjectType, Field, InputType } from "type-graphql";
import User from "./user";
import Column from "./column";
import Vote from "./vote";

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

  @Field(() => [Vote], { nullable: true })
  votes?: Vote[];
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
export class SetCardDescriptionInput {
  @Field()
  description: string;
}

@InputType()
export class UpdateCardInput {
  @Field({ nullable: true })
  setColumn?: SetCardColumnInput;
  @Field({ nullable: true })
  setDescription?: SetCardDescriptionInput;
}

@ObjectType()
export class UpdateCardPayload extends CardPayload {}
