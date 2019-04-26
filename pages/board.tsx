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
          column
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
  mutation CreateCard($description: String!, $column: String!) {
    createCard(input: { description: $description, column: $column }) {
      id
      description
      column
      owner {
        name
        id
        email
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

  moveCard = (/*columnIndex, rowIndex, destColumnIndex, destRowIndex*/) => {};

  onDragEnd = () => {
    // const columnIndex = event.source.droppableId.split("-")[1];
    // const rowIndex = event.source.index;
    // const destColumnIndex = event.destination.droppableId.split("-")[1];
    // const destRowIndex = event.destination.index;
    // this.moveCard(columnIndex, rowIndex, destColumnIndex, destRowIndex);
  };

  renderColumn(column: ColumnState, index: number) {
    return (
      <CreateCardMutation
        key={column.id}
        mutation={CREATE_CARD}
        onCompleted={this._handleCreateCardComplete}
        update={(cache, { data }) => {
          const { board } = cache.readQuery<Board>({ query: GET_BOARD });
          column = board.columns.find(c => c.name === data.createCard.column);
          column.cards.push(data.createCard);
          cache.writeQuery({ query: GET_BOARD, data: { board } });
        }}
      >
        {createCard => {
          return (
            <Droppable droppableId={`column-${index}`}>
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
                          column: columnId,
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

  render() {
    const self = this;
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
                <div className="mom-board">
                  <DragDropContext onDragEnd={self.onDragEnd}>
                    {data.board.columns.map((c, i) => this.renderColumn(c, i))}
                  </DragDropContext>
                </div>
              </div>
            );
          }}
        </BoardQuery>
      </div>
    );
  }
}
