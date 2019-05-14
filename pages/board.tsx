import * as React from "react";
import BoardColumn from "../components/BoardColumn/BoardColumn";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import * as SocketIO from "socket.io";
import "../styles.scss";
import { Query, Mutation, MutationResult } from "react-apollo";
import gql from "graphql-tag";
import {
  Board,
  BoardVariables,
  Board_board_columns_cards,
  Board_board_columns
} from "./types/Board";
import { CreateCard, CreateCardVariables } from "./types/CreateCard";
import { ColumnState } from "types";
import { MoveCard, MoveCardVariables } from "./types/MoveCard";
import { DataProxy } from "apollo-cache";

class BoardQuery extends Query<Board, BoardVariables> {}
const GET_BOARD = gql`
  query Board($id: String!) {
    board(id: $id) {
      id
      name
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

class CreateCardMutation extends Mutation<CreateCard, CreateCardVariables> {}
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

class MoveCardMutation extends Mutation<MoveCard, MoveCardVariables> {}
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

export interface Props {
  id: string;
}

interface State {
  newCardTitle: string;
}

class BoardPage extends React.Component<Props, State> {
  protected getSocket = () => this.socket;
  private socket: SocketIO.Socket;

  static getInitialProps(ctx) {
    return ctx.query;
  }

  state = {
    newCardTitle: ""
  };

  _handleCardChange = (value: string) => this.setState({ newCardTitle: value });

  _handleCreateCardComplete = () => {
    this.setState({ newCardTitle: "" });
  };

  _handleCreatedCard = (cache: DataProxy, { data }: { data: CreateCard }) => {
    const { board } = cache.readQuery<Board>({
      query: GET_BOARD,
      variables: { id: this.props.id }
    });
    const column = board.columns.find(
      c => c.id === data.createCard.card.column.id
    );
    column.cards.push(data.createCard.card);
    cache.writeQuery({
      query: GET_BOARD,
      variables: { id: this.props.id },
      data: { board }
    });
  };

  _handleMovedCard = (cache: DataProxy, result: MutationResult<MoveCard>) => {
    const updateCard = result.data.updateCard;
    // Read the data from our cache for this query.
    const data = cache.readQuery<Board, BoardVariables>({
      query: GET_BOARD,
      variables: { id: this.props.id }
    });

    let cardSourceIndex = -1;
    let sourceColumn: Board_board_columns;

    // Find the column that the card currently belongs to.
    for (const column of data.board.columns) {
      const index = column.cards.findIndex(c => c.id === updateCard.card.id);
      if (index > -1) {
        cardSourceIndex = index;
        sourceColumn = column;
        break;
      }
    }

    // If we found the card and the source column !- dest column, move the card
    if (sourceColumn && cardSourceIndex !== -1) {
      let card: Board_board_columns_cards;
      card = sourceColumn.cards[cardSourceIndex];
      sourceColumn.cards.splice(cardSourceIndex, 1);
      const destColumn = data.board.columns.find(
        c => c.id === updateCard.card.column.id
      );
      destColumn.cards.push(card);

      cache.writeQuery<Board, BoardVariables>({
        query: GET_BOARD,
        variables: { id: this.props.id },
        data
      });
    }
  };

  _renderColumn(column: ColumnState, index: number) {
    return (
      <CreateCardMutation
        key={column.id}
        mutation={CREATE_CARD}
        variables={{
          columnId: column.id,
          description: this.state.newCardTitle
        }}
        onCompleted={this._handleCreateCardComplete}
        update={this._handleCreatedCard}
      >
        {createCard => {
          return (
            <Droppable droppableId={column.id}>
              {provided => (
                <div
                  className="mom-board__column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <BoardColumn
                    key={`${column.name}${{ index }}`}
                    id={column.id}
                    name={column.name}
                    cards={column.cards}
                    onAddNewCard={() => createCard()}
                    onNewCardTitleChange={this._handleCardChange}
                    newCardTitle={this.state.newCardTitle}
                    showAdd={index === 0}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        }}
      </CreateCardMutation>
    );
  }

  _renderBoard(data: Board) {
    return (
      <MoveCardMutation mutation={MOVE_CARD} update={this._handleMovedCard}>
        {moveCard => {
          return (
            <div className="mom-board">
              <DragDropContext
                onDragEnd={e => {
                  moveCard({
                    variables: {
                      columnId: e.destination.droppableId,
                      id: e.draggableId
                    },
                    optimisticResponse: {
                      updateCard: {
                        __typename: "UpdateCardPayload",
                        card: {
                          __typename: "Card",
                          id: e.draggableId,
                          column: {
                            __typename: "Column",
                            id: e.destination.droppableId
                          }
                        }
                      }
                    }
                  });
                }}
              >
                {data.board.columns.map((c, i) => this._renderColumn(c, i))}
              </DragDropContext>
            </div>
          );
        }}
      </MoveCardMutation>
    );
  }

  render() {
    return (
      <div className="mom-container">
        <BoardQuery
          query={GET_BOARD}
          variables={{ id: this.props.id }}
          // pollInterval={1000}
        >
          {({ data, loading }) => {
            if (loading) {
              return <div>Loading...</div>;
            }
            return (
              <div>
                <div>{data.board.name}</div>
                {this._renderBoard(data)}
              </div>
            );
          }}
        </BoardQuery>
      </div>
    );
  }
}

export default BoardPage;
