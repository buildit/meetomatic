import { ObjectType, Field, createUnionType } from "type-graphql";
import { CreateCardPayload, UpdateCardPayload } from "./card";
import { CreateVotePayload } from "./vote";

export enum CardUpdates {
  Created = "CardCreated",
  Moved = "CardMoved",
  Renamed = "CardRenamed",
  Upvoted = "CardUpvoted"
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

@ObjectType()
export class CardUpvotedUpdate extends CreateVotePayload {
  name: CardUpdates = CardUpdates.Upvoted;
}

const BoardUpdateUnion = createUnionType({
  name: "BoardUpdate", // the name of the GraphQL union
  types: [
    CardCreatedUpdate,
    CardMovedUpdate,
    CardRenamedUpdate,
    CardUpvotedUpdate
  ], // array of object types classes,
  resolveType: (
    value:
      | CardCreatedUpdate
      | CardMovedUpdate
      | CardRenamedUpdate
      | CardUpvotedUpdate
  ) => {
    switch (value.name) {
      case CardUpdates.Created:
        return CardCreatedUpdate;
      case CardUpdates.Moved:
        return CardMovedUpdate;
      case CardUpdates.Renamed:
        return CardRenamedUpdate;
      case CardUpdates.Upvoted:
        return CardUpvotedUpdate;
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
