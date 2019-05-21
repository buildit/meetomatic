import { Field, ObjectType, InputType } from "type-graphql";
import User from "./user";
import Card from "./card";

@ObjectType()
export default class Vote {
  @Field()
  id: string;

  @Field()
  upvote: boolean;

  @Field()
  owner?: User;

  @Field(() => Card)
  card?: Card;
}

@InputType()
export class CreateVoteInput {
  @Field()
  upvote: boolean;

  @Field()
  cardId: string;
}

@ObjectType()
class VotePayload {
  @Field()
  vote: Vote;
}

@ObjectType()
export class CreateVotePayload extends VotePayload {}