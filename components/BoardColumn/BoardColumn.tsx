import * as React from "react";
import Card from "../Card/Card";
import NewCard from "../NewCard/NewCard";
import { ColumnState } from "../../types";

interface BoardDefaultProps {
  showAdd: Boolean;
}
interface BoardColumnProps extends ColumnState, Partial<BoardDefaultProps> {
  newCardTitle: string;
  onAddNewCard(columnId: string): void;
  onNewCardTitleChange(value: string): void;
  onClickCard(id: string): void;
  onDeleteCard(id: string): void;
}

export default class BoardColumn extends React.Component<BoardColumnProps, {}> {
  static defaultProps: BoardDefaultProps = {
    showAdd: false
  };

  _handleAddNewCard = () => this.props.onAddNewCard(this.props.id);

  render() {
    return (
      <div>
        <h2 className="mom-board__column-title">{this.props.name}</h2>
        {this.props.cards &&
          this.props.cards.length > 0 &&
          this.props.cards.map((card, index) => {
            return (
              <Card
                id={card.id}
                key={card.id}
                index={index}
                description={card.description}
                votes={0}
                onClick={this.props.onClickCard}
                onDelete={this.props.onDeleteCard}
              />
            );
          })}
        {this.props.showAdd && (
          <NewCard
            addNewCard={this._handleAddNewCard}
            handleCardChange={this.props.onNewCardTitleChange}
            newCardTitle={this.props.newCardTitle}
          />
        )}
      </div>
    );
  }
}
