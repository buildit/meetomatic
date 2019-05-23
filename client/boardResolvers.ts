import { Board } from "./types/Board";
import { DataProxy } from "apollo-cache";
import { GET_USER } from "./queries";
import { CurrentUser } from "./types/CurrentUser";

export default {
  Board: {
    async remainingVotes(
      board: Board,
      _args: any,
      { cache }: { cache: DataProxy }
    ) {
      try {
        const { currentUser } = await cache.readQuery<CurrentUser>({
          query: GET_USER
        });
        // Count up the number of votes cast by the current user on this board.
        // Interate through the columns and cards.
        const votes = board.columns.reduce((count, column) => {
          return (
            count +
            column.cards.reduce((count, card) => {
              return (
                count +
                card.votes.filter(v => v.owner.id === currentUser.id).length
              );
            }, 0)
          );
        }, 0);
        const remainingVotes = board.maxVotes - votes;
        return remainingVotes < 0 ? 0 : remainingVotes;
      } catch {
        return 0;
      }
    }
  }
};
