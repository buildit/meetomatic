import * as React from "react";
import { BoardState } from "../../types";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import BoardColumn from "../BoardColumn/BoardColumn";

interface BoardDefaultProps {
  showAdd: Boolean;
}
interface BoardProps extends BoardState, Partial<BoardDefaultProps> {
  newCardTitle: string;
  onAddNewCard(columnId: string): void;
  onNewCardTitleChange(value: string): void;
  onMoveCard(cardId: string, destColumnId: string): void;
  onClickCard(cardId: string): void;
  onDeleteCard(cardId: string): void;
}

export default class Board extends React.Component<BoardProps, {}> {
  _handleAddNewCard = (columnId: string) => this.props.onAddNewCard(columnId);
  _handleDragEnd = (e: DropResult) =>
    this.props.onMoveCard(e.draggableId, e.destination.droppableId);

  render() {
    return (
      <div className="mom-board">
        <DragDropContext onDragEnd={this._handleDragEnd}>
          {this.props.columns.map((column, i) => {
            return (
              <Droppable droppableId={column.id} key={column.id}>
                {provided => (
                  <div
                    className="mom-board__column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <BoardColumn
                      key={`${column.name}${{ i }}`}
                      id={column.id}
                      name={column.name}
                      cards={column.cards}
                      newCardTitle={this.props.newCardTitle}
                      showAdd={i === 0}
                      onAddNewCard={this._handleAddNewCard}
                      onNewCardTitleChange={this.props.onNewCardTitleChange}
                      onClickCard={this.props.onClickCard}
                      onDeleteCard={this.props.onDeleteCard}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
    );
  }
}
