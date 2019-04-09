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
      <div className="mom-board__column">
        <h2 className="mom-board__column-title">{this.props.title}</h2>
        {this.props.cards && this.props.cards.length > 0 && this.props.cards.map(card => {
          return <Card title={card.title} date="" votes={card.votes} />
        })}
        {this.props.index === 0 ? <NewCard title={this.props.title} addNewCard={this.props.addNewCard} handleCardChange={this.props.handleCardChange} NewCardTitle={this.props.NewCardTitle} /> : null}
      </div>
    );
  }
}
