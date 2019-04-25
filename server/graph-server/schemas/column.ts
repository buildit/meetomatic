import { ObjectType, Field } from "type-graphql";
import Card from "./card";

@ObjectType()
export default class Column {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [Card], { nullable: true })
  cards?: Card[];
}
