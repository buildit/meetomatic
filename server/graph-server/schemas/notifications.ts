import { ObjectType, Field, createUnionType } from "type-graphql";
import {
  CreateCardPayload,
  UpdateCardPayload,
  UpvoteCardPayload,
  DownvoteCardPayload
} from "./card";

export enum CardUpdates {
  Created = "CardCreated",
  Moved = "CardMoved",
  Renamed = "CardRenamed",
  Upvoted = "CardUpvoted",
  Downvoted = "CardDownvoted"
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
export class CardUpvotedUpdate extends UpvoteCardPayload {
  name: CardUpdates = CardUpdates.Upvoted;
}

@ObjectType()
export class CardDownvotedUpdate extends DownvoteCardPayload {
  name: CardUpdates = CardUpdates.Downvoted;
}

const BoardUpdateUnion = createUnionType<
  [
    typeof CardCreatedUpdate,
    typeof CardMovedUpdate,
    typeof CardUpvotedUpdate,
    typeof CardRenamedUpdate,
    typeof CardDownvotedUpdate
  ]
>({
  name: "BoardUpdate", // the name of the GraphQL union
  types: [
    CardCreatedUpdate,
    CardMovedUpdate,
    CardRenamedUpdate,
    CardUpvotedUpdate,
    CardDownvotedUpdate
  ], // array of object types classes,
  resolveType: (
    value:
      | CardCreatedUpdate
      | CardMovedUpdate
      | CardRenamedUpdate
      | CardUpvotedUpdate
      | CardDownvotedUpdate
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
      case CardUpdates.Downvoted:
        return CardDownvotedUpdate;
    }
  }
});

@ObjectType()
export class BoardNotification {
  @Field()
  boardId!: string;
  @Field(() => [BoardUpdateUnion])
  updates!: typeof BoardUpdateUnion[];
}
