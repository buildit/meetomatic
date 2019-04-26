import * as React from "react";
import BoardColumn from "../components/BoardColumn/BoardColumn";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
// import * as io from "socket.io-client";
import * as SocketIO from "socket.io";
import "../styles.scss";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Board } from "./types/board";

class BoardQuery extends Query<Board> {}
const GET_BOARD = gql`
  query Board {
    board(id: "123") {
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
const boardColumns = [
  {
    title: "To do",
    cards: [
      {
        title: "This is a test card",
        votes: 3
      },
      {
        title: "This is another test card",
        votes: 1
      }
    ]
  },
  {
    title: "In Progress",
    cards: [
      {
        title: "This card is in progress",
        votes: 4
      }
    ]
  },
  {
    title: "Done",
    cards: []
  }
];

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

interface State {
  hello: string;
  board: Array<any>;
  NewCardTitle: string;
}

export default class extends React.Component<Props, State> {
  protected getSocket = () => this.socket;
  private socket: SocketIO.Socket;

  constructor(props) {
    super(props);

    // this.socket = io();
    this.state = {
      hello: "",
      board: boardColumns,
      NewCardTitle: ""
    };

    this.handleCardChange = this.handleCardChange.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
  }

  handleCardChange(event) {
    this.setState({ NewCardTitle: event.target.value });
  }

  addNewCard() {
    const board = this.state.board;
    const newCard = { title: this.state.NewCardTitle, votes: 0 };

    board[0].cards.push(newCard);

    this.setState({
      board,
      NewCardTitle: ""
    });
  }

  moveCard = (columnIndex, rowIndex, destColumnIndex, destRowIndex) => {
    const board = this.state.board;
    const movedCard = board[columnIndex].cards.splice(rowIndex, 1)[0];

    board[destColumnIndex].cards.splice(destRowIndex, 0, movedCard);

    this.setState({
      board
    });
  };

  onDragEnd = event => {
    const columnIndex = event.source.droppableId.split("-")[1];
    const rowIndex = event.source.index;
    const destColumnIndex = event.destination.droppableId.split("-")[1];
    const destRowIndex = event.destination.index;

    this.moveCard(columnIndex, rowIndex, destColumnIndex, destRowIndex);
  };

  // componentDidMount() {
  //   this.socket.on("connected", data => {
  //     this.setState({
  //       hello: data.message
  //     });
  //   });
  // }

  render() {
    return (
      <div className="mom-container">
        <div className="mom-board">
          <BoardQuery query={GET_BOARD}>
            {({ data, loading }) => {
              data.board.name;
              if (loading) {
                return <div>Loading...</div>;
              }
              return (
                <div>
                  {/* {boardData.columns.map}
                  {boardData && boardData.name} */}
                </div>
              );
            }}
          </BoardQuery>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {this.state.board.map((column, index) => {
              return (
                <Droppable droppableId={`column-${index}`}>
                  {provided => (
                    <div
                      className="mom-board__column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <BoardColumn
                        index={index}
                        key={`${column.title}${{ index }}`}
                        title={column.title}
                        cards={column.cards}
                        addNewCard={this.addNewCard}
                        handleCardChange={this.handleCardChange}
                        NewCardTitle={this.state.NewCardTitle}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </DragDropContext>
        </div>
      </div>
    );
  }
}
