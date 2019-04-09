import * as React from "react";
import CardInterface from "./Card.interface";

const REQUIRED_VOTES = 3;

export default class Card extends React.Component<CardInterface, {}> {
  constructor(props: CardInterface) {
    super(props);
  }
  render() {
    return (
      <div className="grav-c-card">
        <p className="grav-c-card__body">{this.props.title}</p>
        <p className="mom-c-votes">
          {this.props.votes} {this.props.votes > 1 ? "votes" : "vote"}
        </p>
      </div>
    );
  }
}
