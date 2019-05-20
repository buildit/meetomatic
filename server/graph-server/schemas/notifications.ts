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

@ObjectType()
export class CardRenamedUpdate extends UpdateCardPayload {
  name: CardUpdates = CardUpdates.Renamed;
}

const BoardUpdateUnion = createUnionType({
  name: "BoardUpdate", // the name of the GraphQL union
  types: [CardCreatedUpdate, CardMovedUpdate, CardRenamedUpdate], // array of object types classes,
  resolveType: (
    value: CardCreatedUpdate | CardMovedUpdate | CardRenamedUpdate
  ) => {
    if (value.name === CardUpdates.Created) {
      return CardCreatedUpdate;
    } else if (value.name === CardUpdates.Moved) {
      return CardMovedUpdate;
    } else if (value.name === CardUpdates.Renamed) {
      return CardRenamedUpdate;
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
