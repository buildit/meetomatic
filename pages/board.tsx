import * as React from "react";
import BoardWidget from "../components/Board/Board";
import "../styles.scss";
import { Query, withApollo } from "react-apollo";
import gql from "graphql-tag";
import {
  Board,
  BoardVariables,
  Board_board_columns_cards,
  Board_board_columns
} from "./types/Board";
import { CreateCard, CreateCardVariables } from "./types/CreateCard";
import { MoveCard, MoveCardVariables } from "./types/MoveCard";
import { DataProxy } from "apollo-cache";
import ApolloClient from "apollo-client";
import { BoardUpdated, BoardUpdatedVariables } from "./types/BoardUpdated";

class BoardQuery extends Query<Board, BoardVariables> {}
const GET_BOARD = gql`
  query Board($id: String!) {
    board(id: $id) {
      id
      name
      owner {
        id
        name
        email
      }
      columns {
        id
        name
        cards {
          id
          description
          column {
            id
            name
          }
          owner {
            id
            name
            email
          }
        }
      }
    }
  }
`;

const CREATE_CARD = gql`
  mutation CreateCard($description: String!, $columnId: String!) {
    createCard(input: { description: $description, columnId: $columnId }) {
      card {
        id
        description
        column {
          id
          name
        }
        owner {
          name
          id
          email
        }
      }
    }
  }
`;

const MOVE_CARD = gql`
  mutation MoveCard($id: String!, $columnId: String!) {
    updateCard(id: $id, input: { setColumn: { columnId: $columnId } }) {
      card {
        id
        column {
          id
        }
      }
    }
  }
`;

const BOARD_UPDATED_SUBSCRIPTION = gql`
  subscription BoardUpdated($boardId: String!) {
    boardUpdated(boardId: $boardId) {
      boardId
      updates {
        __typename
        ... on CardCreatedUpdate {
          card {
            id
            description
            column {
              id
              name
            }
            owner {
              name
              id
              email
            }
          }
        }
        __typename
        ... on CardMovedUpdate {
          card {
            id
            column {
              id
            }
          }
        }
      }
    }
  }
`;

export interface Props {
  id: string;
  client: ApolloClient<any>;
}

interface State {
  newCardTitle: string;
}

class BoardPage extends React.Component<Props, State> {
  private subscription;

  static getInitialProps(ctx) {
    return ctx.query;
  }

  state = {
    newCardTitle: ""
  };

  componentDidMount() {
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

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
    this.props.client.mutate<MoveCard, MoveCardVariables>({
      mutation: MOVE_CARD,
      variables: {
        columnId,
        id
      },
      optimisticResponse: {
        updateCard: {
          __typename: "UpdateCardPayload",
          card: {
            __typename: "Card",
            id,
            column: {
              __typename: "Column",
              id: columnId
            }
          }
        }
      },
      update: this._handleMovedCard
    });
  };

  render() {
    return (
      <div className="mom-container">
        <BoardQuery query={GET_BOARD} variables={{ id: this.props.id }}>
          {({ data, loading }) => {
            if (loading) {
              return <div>Loading...</div>;
            }
            return (
              <div>
                <div>{data.board.name}</div>
                <BoardWidget
                  id={data.board.id}
                  name={data.board.name}
                  columns={data.board.columns}
                  owner={data.board.owner}
                  newCardTitle={this.state.newCardTitle}
                  onNewCardTitleChange={this._handleNewCardTitleChange}
                  onAddNewCard={this._handleCreateCard}
                  onMoveCard={this._handleMoveCard}
                />
              </div>
            );
          }}
        </BoardQuery>
      </div>
    );
  }
}

export default withApollo(BoardPage);
