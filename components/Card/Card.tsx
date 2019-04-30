import * as React from "react";
import CardInterface from "./Card.interface";
import CardVote from "../CardVote/CardVote";
import { Draggable } from "react-beautiful-dnd";

export default class Card extends React.Component<CardInterface, {}> {
  constructor(props: CardInterface) {
    super(props);
  }
  render() {
    return (
      <Draggable className="grav-c-card" draggableId={this.props.title} index={this.props.index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="grav-c-card">
              <p className="grav-c-card__body">{this.props.title}</p>
                <CardVote voteCount={this.props.votes} handleVotes={this.props.handleVotes} cardId={this.props.cardId} />
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}
