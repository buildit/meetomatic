import { ObjectType, Field, createUnionType } from "type-graphql";
import { CreateCardPayload, UpdateCardPayload } from "./card";
import { CreateVotePayload, DeleteVotePayload } from "./vote";

export enum CardUpdates {
  Created = "CardCreated",
  Moved = "CardMoved",
  Renamed = "CardRenamed",
  Upvoted = "CardUpvoted",
  VoteDeleted = "CardVoteDeleted"
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

@ObjectType()
export class CardVoteDeletedUpdate extends DeleteVotePayload {
  name: CardUpdates = CardUpdates.VoteDeleted;
}

const BoardUpdateUnion = createUnionType({
  name: "BoardUpdate", // the name of the GraphQL union
  types: [
    CardCreatedUpdate,
    CardMovedUpdate,
    CardRenamedUpdate,
    CardUpvotedUpdate,
    CardVoteDeletedUpdate
  ], // array of object types classes,
  resolveType: (
    value:
      | CardCreatedUpdate
      | CardMovedUpdate
      | CardRenamedUpdate
      | CardUpvotedUpdate
      | CardVoteDeletedUpdate
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
      case CardUpdates.VoteDeleted:
        return CardVoteDeletedUpdate;
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
