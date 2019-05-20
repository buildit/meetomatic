import { Field, ObjectType } from "type-graphql";
import User from "./user";
import Card from "./card";

@ObjectType()
export default class Vote {
  @Field()
  id: string;

  @Field()
  upVote: boolean;

  @Field()
  owner?: User;

  @Field(() => Card)
  card?: Card;
}
