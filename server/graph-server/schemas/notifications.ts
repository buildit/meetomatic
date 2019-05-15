import { ObjectType, Field, createUnionType } from "type-graphql";
import { CreateCardPayload, UpdateCardPayload } from "./card";

export enum CardUpdates {
  Created = "CardCreated",
  Moved = "CardMoved",
  Renamed = "CardRenamed"
}
@ObjectType()
export class CardCreatedUpdate extends CreateCardPayload {
  name: CardUpdates = CardUpdates.Created;
}

@ObjectType()
export class CardMovedUpdate extends UpdateCardPayload {
  name: CardUpdates = CardUpdates.Moved;
}

const BoardUpdateUnion = createUnionType({
  name: "BoardUpdate", // the name of the GraphQL union
  types: [CardCreatedUpdate, CardMovedUpdate], // array of object types classes,
  resolveType: (value: CardCreatedUpdate | CardMovedUpdate) => {
    if (value.name === "CardCreated") {
      return CardCreatedUpdate;
    } else if (value.name === "CardMoved") {
      return CardMovedUpdate;
    }
  }
});

@ObjectType()
export class BoardNotification {
  @Field()
  boardId: string;
  @Field(() => [BoardUpdateUnion])
  updates: typeof BoardUpdateUnion[];
}
