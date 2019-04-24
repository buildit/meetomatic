import { ObjectType, Field, InputType } from "type-graphql";
import User from "./user";

@ObjectType()
export default class Card {
  @Field()
  id: string;

  @Field()
  description: string;

  @Field()
  column: string;

  @Field({ nullable: true })
  owner?: User;
}

@InputType()
export class CreateCardInput {
  @Field()
  description: string;

  @Field()
  column: string;
}
