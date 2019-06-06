import * as React from "react";
import BoardWidget from "../components/Board/Board";
import { Query, withApollo } from "react-apollo";
import Modal from "react-modal";

import {
  Board,
  BoardVariables,
  Board_board_columns_cards,
  Board_board_columns,
  Board_board
} from "../client/types/Board";

import { CreateCard, CreateCardVariables } from "./types/CreateCard";
import { DeleteCard, DeleteCardVariables } from "./types/DeleteCard";

import {
  MoveCard,
  MoveCardVariables,
  MoveCard_updateCard
} from "./types/MoveCard";
import { DataProxy } from "apollo-cache";

import { BoardUpdated, BoardUpdatedVariables } from "./types/BoardUpdated";

import {
  RenameCard,
  RenameCardVariables,
  RenameCard_updateCard
} from "./types/RenameCard";


import { Card } from "./types/Card";
import EditCardForm from "../components/EditCardForm/EditCardForm";
import ApolloClient from "apollo-client";
import BoardStatusBar from "../components/BoardStatusBar/BoardStatusBar";
import { UpvoteCard, UpvoteCardVariables } from "../client/types/UpvoteCard";
import { UserState } from "../types";
import {
  DownvoteCard,
  DownvoteCardVariables
} from "../client/types/DownvoteCard";


import { CREATE_CARD, DELETE_CARD, UPVOTE_CARD, DOWNVOTE_CARD } from "../client/queries/card";

import { BOARD_UPDATED_SUBSCRIPTION, GET_BOARD } from "../client/queries/board";

import {  
  MOVE_CARD,
  RENAME_CARD
} from "../client/fragments/cardFragments";

import BoardApi from "../client/api/boardApi";

class BoardQuery extends Query<Board, BoardVariables> {}

export interface Props {
  id: string;
  client: ApolloClient<any>;
  subscribeToUpdates: boolean;
  BoardName: string;
  user: UserState;
}

interface State {
  newCardTitle: string;
  cardId: string;
}

class BoardPage extends React.Component<Props, State> {
  private subscription;
  private _boardApi;

  static defaultProps = {
    subscribeToUpdates: true
  };

  static getInitialProps(ctx) {
    return { ...ctx.query, user: ctx.user };
  }

  state = {
    newCardTitle: "",
    cardId: ""
  };

  componentDidMount() {
    this._boardApi  = new BoardApi(this.props.client, this.props.id);

    if (this.props.subscribeToUpdates) {
      this.subscription = this.props.client
        .subscribe<{ data: BoardUpdated }, BoardUpdatedVariables>({
          query: BOARD_UPDATED_SUBSCRIPTION,
          variables: {
            boardId: this.props.id
          }
        })
        .subscribe(({ data }) => {
          // If we a get a board notificaiton, turn it in to a Payload
          // and use the existing logic for updating the store
          data.boardUpdated.updates.forEach(update => {
            console.log(update);
            if (update.__typename === "CardCreatedUpdate") {
              this._handleCreatedCard(this.props.client, {
                data: {
                  createCard: {
                    __typename: "CreateCardPayload",
                    card: update.card
                  }
                }
              });
            } else if (update.__typename === "CardMovedUpdate") {
              this._handleMovedCard(this.props.client, {
                data: {
                  updateCard: {
                    __typename: "UpdateCardPayload",
                    card: update.card
                  }
                }
              });
            } else if (update.__typename === "CardUpvotedUpdate") {
              this._handleCardUpvoted(this.props.client, {
                data: {
                  upvoteCard: {
                    __typename: "UpvoteCardPayload",
                    card: update.card,
                    vote: update.vote
                  }
                }
              });
            } else if (update.__typename === "CardDownvotedUpdate") {
              this._handleCardDownvoted(this.props.client, {
                data: {
                  downvoteCard: {
                    __typename: "DownvoteCardPayload",
                    card: update.card,
                    voteId: update.voteId
                  }
                }
              });
            }
          });
        });
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private _createCardUpdateRespone(
    card: Card
  ): RenameCard_updateCard | MoveCard_updateCard {
    return {
      __typename: "UpdateCardPayload",
      card: {
        __typename: "Card",
        id: card.id,
        description: card.description,
        column: {
          __typename: card.column.__typename,
          id: card.column.id,
          name: card.column.name
        },
        owner: {
          __typename: card.owner.__typename,
          id: card.owner.id
        }
      }
    };
  }


  private _findCard(cardId: string, board: Board_board) {
    for (const column of board.columns) {
      const card = column.cards.find(c => c.id === cardId);
      if (card) {
        return card;
      }
    }
    return null;
  }

  private _readBoard(cache: DataProxy): Board_board {
    return cache.readQuery<Board, BoardVariables>({
      query: GET_BOARD,
      variables: { id: this.props.id }
    }).board;
  }

  private _writeBoard(cache: DataProxy, board: Board_board) {
    cache.writeQuery<Board, BoardVariables>({
      query: GET_BOARD,
      variables: { id: this.props.id },
      data: { board }
    });
  }

  _handleNewCardTitleChange = (value: string) =>
    this.setState({ newCardTitle: value });

  /**
   * Card creation was completed at the server
   *
   * Add the new card to the correct column.
   * Note this can also be called as the result of a subscription notification
   */
  _handleCreatedCard = (cache: DataProxy, { data }: { data: CreateCard }) => {
    const board =  this._boardApi._readBoard(cache);

    const column = board.columns.find(
      c => c.id === data.createCard.card.column.id
    );
    // Card was already added (optimistic update or subscription)
    if (column.cards.find(c => c.id === data.createCard.card.id)) {
      return;
    }
    column.cards.push(data.createCard.card);

    this._boardApi._writeBoard(cache, board);

    this.setState({ newCardTitle: "" });
  };

  /**
   * Card move was completed at the server.
   *
   * Update our board cache by moving the card between columns
   */
  _handleMoveCard = (id: string, columnId: string) => {
    const card = this._boardApi._getCard(id)
    const optimisticResponse = this._createCardUpdateRespone(card);
    optimisticResponse.card.column.id = columnId;
 
    this.props.client.mutate<MoveCard, MoveCardVariables>({
      mutation: MOVE_CARD,
      variables: {
        columnId,
        id
      },
      optimisticResponse: {
        updateCard: optimisticResponse
      },
      update: this._handleMovedCard
    });
  };

  _handleMovedCard = (cache: DataProxy, { data }: { data: MoveCard }) => {
    const updateCard = data.updateCard;
    // Read the data from our cache for this query.
    const { board } = cache.readQuery<Board, BoardVariables>({
      query: GET_BOARD,
      variables: { id: this.props.id }
    });
 
    let cardSourceIndex = -1;
    let sourceColumn: Board_board_columns;
 
    // Find the column that the card currently belongs to.
    for (const column of board.columns) {
      const index = column.cards.findIndex(c => c.id === updateCard.card.id);
      if (index > -1) {
        cardSourceIndex = index;
        sourceColumn = column;
        break;
      }
    }
 
    // If we found the card and the source column != dest column, move the card
    if (sourceColumn && cardSourceIndex !== -1) {
      let card: Board_board_columns_cards;
      card = sourceColumn.cards[cardSourceIndex];
      sourceColumn.cards.splice(cardSourceIndex, 1);
      const destColumn = board.columns.find(
        c => c.id === updateCard.card.column.id
      );
      destColumn.cards.push(card);
      cache.writeQuery<Board, BoardVariables>({
        query: GET_BOARD,
        variables: { id: this.props.id },
        data: { board }
      });
    }
  };

  _handleCardDownvoted = (
    cache: DataProxy,
    { data }: { data: DownvoteCard }
  ) => {
    const board = this._readBoard(cache);
    const card = this._findCard(data.downvoteCard.card.id, board);
    card.votes = card.votes.filter(v => v.id !== data.downvoteCard.voteId);
    this._writeBoard(cache, board);
  };

  _handleCardUpvoted = (cache: DataProxy, { data }: { data: UpvoteCard }) => {
    const board = this._readBoard(cache);
    const card = this._findCard(data.upvoteCard.card.id, board);
    const vote = card.votes.find(v => v.id === data.upvoteCard.vote.id);
    if (!vote) {
      card.votes.push(data.upvoteCard.vote);
      this._writeBoard(cache, board);
    }
  };

  /**
   * User wants to a create a new card
   */
  _handleCreateCard = (columnId: string) => {
    this.props.client.mutate<CreateCard, CreateCardVariables>({
      mutation: CREATE_CARD,
      variables: {
        columnId,
        description: this.state.newCardTitle
      },
      update: this._handleCreatedCard
    });
  };

  _handleRenameCard = (id: string, description: string) => {
    const card = this._boardApi._getCard(id);
    const optimisticResponse = this._createCardUpdateRespone(card);
    this.props.client.mutate<RenameCard, RenameCardVariables>({
      mutation: RENAME_CARD,
      variables: {
        id,
        description
      },
      optimisticResponse: {
        updateCard: {
          __typename: optimisticResponse.__typename,
          card: {
            ...optimisticResponse.card,
            description
          }
        }
      }
    });
  };

  _handleUpvoteCard = cardId => {
    this.props.client
      .mutate<UpvoteCard, UpvoteCardVariables>({
        mutation: UPVOTE_CARD,
        variables: {
          cardId
        },
        optimisticResponse: {
          upvoteCard: {
            card: {
              id: cardId,
              __typename: "Card"
            },
            vote: {
              id: (Math.random() * -1000000).toString(),
              owner: this.props.user,
              __typename: "Vote"
            },
            __typename: "UpvoteCardPayload"
          }
        },

        update: this._handleCardUpvoted
      })
      .catch(err => alert(err.message));
  };

  _handleDownvotedCard = cardId => {
    const card = this._boardApi._getCard(cardId);
    const vote = card.votes.find(v => v.owner.id == this.props.user.id);
    if (!vote) {
      // TODO: show an error
      return;
    }
    this.props.client
      .mutate<DownvoteCard, DownvoteCardVariables>({
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
        update: this._handleCardDownvoted
      })
      .catch(err => alert(err.message));
  };

  _handleClickCard = async cardId => {
    // this._handleDownvotedCard(cardId);
    // this._handleUpvoteCard(cardId);
    this.setState({ cardId });
  };

  _handleClickDeleted = async cardId => {
    this.props.client.mutate<DeleteCard, DeleteCardVariables>({
      mutation: DELETE_CARD,
      variables: {
       id: cardId,
       date: "2015-03-25T12:00:00Z"
      },
      update: this._handleDeletedCard
    });
  };

  _handleDeletedCard = (cache: DataProxy, { data }: { data: DeleteCard }) => {

    const board =  this._boardApi._readBoard(cache);

    const index = board.columns.findIndex(
      c => c.id === data['updateCard'].card.column.id
    );
    
    console.log("BEFORE");
    console.log(board.columns[index].cards)

  
    const cardToDelete =  board.columns[index].cards.findIndex(x => data['updateCard'].card.id === x.id);

    console.log(cardToDelete);

    if (cardToDelete > -1) {
      board.columns[index].cards.splice(cardToDelete, 1);
    }

    console.log("AFTER");
    console.log(board.columns[index].cards)

    this._boardApi._writeBoard(cache, board);
  };

  _renderCardModal() {
    if (this.state.cardId) {
      const card = this._boardApi._getCard(this.state.cardId)
      return (
        <Modal
          className="card-modal"
          isOpen={true}
          onRequestClose={() => this.setState({ cardId: "" })}
        >
          <EditCardForm {...card} onRenameCard={this._handleRenameCard} />
        </Modal>
      );
    }
    return null;
  }

  render() {
    return (
      <div id="board" className="mom-container">
        <BoardQuery query={GET_BOARD} variables={{ id: this.props.id }}>
          {({ data, loading }) => {
            if (loading) {
              return <div className="loading">Loading...</div>;
            }
            if (!data || !data.board) {
              return null;
            }

            return (
              <div>
                <BoardStatusBar boardName={data.board.name} />
                <BoardWidget
                  id={data.board.id}
                  name={data.board.name}
                  columns={data.board.columns}
                  owner={data.board.owner}
                  newCardTitle={this.state.newCardTitle}
                  onNewCardTitleChange={this._handleNewCardTitleChange}
                  onAddNewCard={this._handleCreateCard}
                  onMoveCard={this._handleMoveCard}
                  onClickCard={this._handleClickCard}
                  onDeleteCard={this._handleClickDeleted}
                />
              </div>
            );
          }}
        </BoardQuery>
        {this._renderCardModal()}
      </div>
    )}
}

export default withApollo(BoardPage);
