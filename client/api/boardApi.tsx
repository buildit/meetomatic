import ApolloClient from "apollo-client";
import { Card } from "../../pages/types/Card";
import {
  Board,
  BoardVariables,
} from "../types/Board";
import { DataProxy } from "apollo-cache";
import { 
  CARD_FRAGMENT
} from "../fragments/cardFragments";
import { GET_BOARD } from "../queries/board";

export default class  BoardApi {
    private client: ApolloClient<any>;
    private user: UserState;
    private boardId: string;

    constructor(client, id){
      this.client = client;
      this.boardId = id;
    }
  
    private _getCard(cardId: string): Card {
      return this.client.readFragment<Card>({
        id: `Card:${cardId}`,
        fragment: CARD_FRAGMENT
      });
    }
  
    private _readBoard(cache: DataProxy): Board {
      console.log(this.boardId);
      const value =  cache.readQuery<Board>({
        query: GET_BOARD,
        variables: { id: this.boardId }
      }).board;

      console.log(value);

      return value;


    }
  
    private _writeBoard(cache: DataProxy, board: Board) {
      cache.writeQuery<Board, BoardVariables>({
        query: GET_BOARD,
        variables: { id: this.boardId },
        data: { board }
      });
    }
  
    private _findCard(cardId: string, board: Board) {
      for (const column of board.columns) {
        const card = column.cards.find(c => c.id === cardId);
        if (card) {
          return card;
        }
      }
      return null;
    }
  
    private cardDownvoted = (
      cache: DataProxy,
      { data }: { data: DownvoteCard }
    ) => {
      const board = this._readBoard(cache);
      const card = this._findCard(data.downvoteCard.card.id, board);
      card.votes = card.votes.filter(v => v.id !== data.downvoteCard.voteId);
      this._writeBoard(cache, board);
    };
  
    public downvoteCard(cardId: string) {
      const card = this._getCard(cardId);
      const vote = card.votes.find(v => v.owner.id == this.user.id);
      if (!vote) {
        // TODO: throw an error
        return;
      }
      return this.client.mutate<DownvoteCard, DownvoteCardVariables>({
        mutation: DOWNVOTE_CARD,
        variables: {
          cardId
        },
        optimisticResponse: {
          downvoteCard: {
            card: {
              id: cardId,
              __typename: "Card"
            },
            voteId: vote.id,
            __typename: "DownvoteCardPayload"
          }
        },
        update: this.cardDownvoted
      });
    }
  }