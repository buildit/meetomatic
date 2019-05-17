import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { CardState } from "types";

interface CardProps extends CardState {
  index: number;
  votes?: number;
  onClick(id: string);
}
export default class Card extends React.Component<CardProps, {}> {
  constructor(props: CardProps) {
    super(props);
  }
  static defaultProps = {
    votes: 0
  };

  _handleClick = () => this.props.onClick(this.props.id);

  render() {
    return (
      <Draggable draggableId={this.props.id} index={this.props.index}>
        {provided => (
          <div
            onClick={this._handleClick}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="grav-c-card">
              <p className="grav-c-card__body">{this.props.description}</p>
              <p className="mom-c-votes">
                {this.props.votes} {this.props.votes > 1 ? "votes" : "vote"}
              </p>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}
