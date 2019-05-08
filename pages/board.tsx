import * as React from "react";
import BoardColumn from "../components/BoardColumn/BoardColumn";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
// import * as io from "socket.io-client";
import * as SocketIO from "socket.io";
import "../styles.scss";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Board, BoardVariables } from "./types/Board";
import { CreateCard, CreateCardVariables } from "./types/CreateCard";
import { ColumnState } from "types";
import { MoveCard, MoveCardVariables } from "./types/MoveCard";

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

export default class BoardPage extends React.Component<Props, State> {
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


  _renderColumn(column: ColumnState, index: number) {
    return (
      <CreateCardMutation
        key={column.id}
        mutation={CREATE_CARD}
        onCompleted={this._handleCreateCardComplete}
        update={(cache, { data }) => {
          const { board } = cache.readQuery<Board>({
            query: GET_BOARD,
            variables: { id: this.props.id }
          });
          column = board.columns.find(
            c => c.id === data.createCard.card.column.id
          );
          column.cards.push(data.createCard.card);
          cache.writeQuery({
            query: GET_BOARD,
            variables: { id: this.props.id },
            data: { board }
          });
        }}
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
                    onAddNewCard={columnId =>
                      createCard({
                        variables: {
                          columnId: columnId,
                          description: this.state.newCardTitle
                        }
                      })
                    }
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
      <MoveCardMutation mutation={MOVE_CARD}>
        {_moveCard => {
          return (
            <div className="mom-board">
              <DragDropContext 
                onDragEnd={(e) => {
                  _moveCard({
                      variables: {
                        id: e.draggableId,
                        columnId: e.destination.droppableId
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
                      },
                      update: (proxy, { data: { updateCard } }) => {
                        console.log(updateCard);
                        // Read the data from our cache for this query.
                        const data = proxy.readQuery({
                          query: GET_BOARD,
                          variables: { id: this.props.id },
                        });

                        // Remove
                        data['board'].columns.forEach(col => {
                            const val = col.cards.filter((card, cardIndex) => {
                             if (card.id === updateCard.card.id) {
                               return { id: cardIndex, item: card};
                             }
                            })

                            if((val).length > 0) {
                             col.cards.splice(val["id"], 1);
                            }
                        })

                        console.log(data);
                        proxy.writeQuery({
                          query: GET_BOARD,
                          data
                        });
                      }
                  })
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
          pollInterval={1000}
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
