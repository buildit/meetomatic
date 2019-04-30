import * as React from "react";
import BoardColumnInterface from "./BoardColumn.interface";
import Card from "../Card/Card";
import NewCard from "../NewCard/NewCard";

export default class BoardColumn extends React.Component<BoardColumnInterface, {}> {
  constructor(props: BoardColumnInterface) {
    super(props);
  }
  render() {
    return (
      <div>
        <h2 className="mom-board__column-title">{this.props.title}</h2>
        {this.props.cards && this.props.cards.length > 0 && this.props.cards.map((card, index) => {
          return <Card key={card.id} cardId={card.id} index={index} title={card.title} date="" votes={card.votes} handleVotes={this.props.handleVotes} />
        })}
        {this.props.index === 0 ? <NewCard addNewCard={this.props.addNewCard} handleCardChange={this.props.handleCardChange} newCardTitle={this.props.newCardTitle} /> : null}
      </div>
    );
  }
}
