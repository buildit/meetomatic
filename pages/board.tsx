import * as React from "react";
import BoardColumn from "../components/BoardColumn/BoardColumn";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import * as io from "socket.io-client";
import * as SocketIO from "socket.io";
import "../styles.scss";

const LOGGED_IN_AS = "0001";
const BOARD_ID = "0001";

// const boardColumns = [
//   {
//     title: "To do",
//     cards: [
//       {
//         title: "This is a test card",
//         votes: 3
//       },
//       {
//         title: "This is another test card",
//         votes: 1
//       }
//     ]
//   },
//   {
//     title: "In Progress",
//     cards: [
//       {
//         title: "This card is in progress",
//         votes: 4
//       }
//     ]
//   },
//   {
//     title: "Done",
//     cards: []
//   }
// ];

const boardColumns = [
  {
    title: "To do",
    cards: []
  },
  {
    title: "In Progress",
    cards: []
  },
  {
    title: "Done",
    cards: []
  }
];

const user = {
  "0001": {
    name: "Daniel",
    boards: {
      "0001": {
        votedCards: []
      }
    }
  },
  "0002": {
    name: "Aris",
    votedCards: []
  }
};

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

interface State {
  hello: string;
  cards: Object;
  board: Array<any>;
  userCards: Array<any>;
  newCardTitle: string;
  newId: string;
}

export default class extends React.Component<Props, State> {
  protected getSocket = () => this.socket;
  private socket: SocketIO.Socket;

  constructor(props) {
    super(props);

    this.socket = io();
    
    this.state = {
      hello: "",
      cards: {},
      board: boardColumns,
      userCards: [],
      newCardTitle: "",
      newId: "0000"
    };

    this.handleCardChange = this.handleCardChange.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.handleVotes = this.handleVotes.bind(this);
  }

  handleCardChange(event) {
    this.setState({ newCardTitle: event.target.value });
  }

  handleVotes(e) {
    const votedCard = e.target.value;
    const userCards = this.state.userCards;
    const board = this.state.board;

    this.setState({
      userCards
    });
  }

  addNewCard() {
    const cards = this.state.cards;
    const board = this.state.board;
    const newCard = {
      title: this.state.newCardTitle,
      column: 0,
      votes: 0
    };

    cards[this.state.newId] = newCard;

    const newId = parseInt(this.state.newId + 1)
      .toString()
      .padStart(4, "0");

    board[0].cards.push(newCard);

    this.setState({
      cards,
      board,
      newCardTitle: "",
      newId,
    });
  }

  moveCard = (columnIndex, rowIndex, destColumnIndex, destRowIndex) => {
    const board = this.state.board;
    const movedCard = board[columnIndex].cards.splice(rowIndex, 1)[0];

    board[destColumnIndex].cards.splice(destRowIndex, 0, movedCard);

    const cards = this.state.cards;
    cards[rowIndex].column = parseInt(destColumnIndex);

    this.setState({
      cards,
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

  componentDidMount() {
    this.socket.on("connected", data => {
      this.setState({
        hello: data.message
      });
    });
  }

  render() {
    return (
      <div className="mom-container">
        <div className="mom-board">
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
                        newCardTitle={this.state.newCardTitle}
                        handleVotes={this.handleVotes}
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
