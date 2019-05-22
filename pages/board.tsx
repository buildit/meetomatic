import * as React from "react";
import BoardWidget from "../components/Board/Board";
import { Query, withApollo } from "react-apollo";

import {
  Board,
  BoardVariables,
  Board_board_columns_cards,
  Board_board_columns
} from "../client/types/Board";

import { CreateCard, CreateCardVariables } from "./types/CreateCard";

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
import Modal from "react-modal";
import EditCardForm from "../components/EditCardForm/EditCardForm";
import ApolloClient from "apollo-client";
import { CREATE_CARD } from "../client/queries/card";
import { BOARD_UPDATED_SUBSCRIPTION, GET_BOARD } from "../client/queries/board";

import {  
  MOVE_CARD,
  RENAME_CARD,
  CARD_UPDATE_FRAGMENT,
  CARD_FRAGMENT
} from "../client/fragments/cardFragments";

class BoardQuery extends Query<Board, BoardVariables> {}


export interface Props {
  id: string;
  client: ApolloClient<any>;
  subscribeToUpdates: boolean;
}

interface State {
  newCardTitle: string;
  cardId: string;
}

// Modal && Modal.setAppElement("#board");

class BoardPage extends React.Component<Props, State> {
  private subscription;

  static defaultProps = {
    subscribeToUpdates: true
  };
  static getInitialProps(ctx) {
    return ctx.query;
  }

  state = {
    newCardTitle: "",
    cardId: ""
  };

  componentDidMount() {
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

  _createCardUpdateRespone(
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

  _getCard(cardId: string): Card {
    return this.props.client.readFragment<Card>({
      id: `Card:${cardId}`,
      fragment: CARD_FRAGMENT
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
    const { board } = cache.readQuery<Board>({
      query: GET_BOARD,
      variables: { id: this.props.id }
    });
    const column = board.columns.find(
      c => c.id === data.createCard.card.column.id
    );
    // Card was already added (optimistic update or subscription)
    if (column.cards.find(c => c.id === data.createCard.card.id)) {
      return;
    }
    column.cards.push(data.createCard.card);
    cache.writeQuery({
      query: GET_BOARD,
      variables: { id: this.props.id },
      data: { board }
    });
    this.setState({ newCardTitle: "" });
  };

  /**
   * Card move was completed at the server.
   *
   * Update our board cache by moving the card between columns
   */
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

  /**
   * User wants to move a card
   */
  _handleMoveCard = (id: string, columnId: string) => {
    const card = this._getCard(id);
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

  _handleRenameCard = (id: string, description: string) => {
    const card = this._getCard(id);
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

  _handleClickCard = async cardId => {
    this.setState({ cardId });
  };

  _renderCardModal() {
    if (this.state.cardId) {
      const card = this._getCard(this.state.cardId);
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
                <div className="board-title">{data.board.name}</div>
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
                />
              </div>
            );
          }}
        </BoardQuery>
        {this._renderCardModal()}
      </div>
    );
  }
}

export default withApollo(BoardPage);
