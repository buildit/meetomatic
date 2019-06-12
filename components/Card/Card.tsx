import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { CardState } from "../../types";
import VoteButton from "../../components/VoteButton/VoteButton";


interface CardProps extends CardState {
  index: number;
  ArchivedOn?: string;
  onClick(id: string);
  onDelete(id: string);
}

interface State {
  hasVoted: boolean;
}

export default class Card extends React.Component<CardProps, State> {
  constructor(props: CardProps) {
    super(props);
    
    this.state = {
      hasVoted: false
    }
  }
  static defaultProps = {
    votes: 0
  };

  _handleClick = () => this.props.onClick(this.props.id);

  _handleDelete = () => this.props.onDelete(this.props.id);
  
  _handleVoteClick = () => {
    this.setState({
      hasVoted: !this.state.hasVoted
    })
  }

  render() {
    return (
      <Draggable draggableId={this.props.id} index={this.props.index}>
        {provided => (
         
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="grav-c-board-card">
              <div className="grav-c-board-card__body">
                <h2 onClick={this._handleClick}>{this.props.description} <span className="grav-c-board-card__reveal-icon">✏️</span></h2>
                <p>{this.props.ArchivedOn}</p>
              </div>
              <p className="mom-c-votes">
                {this.props.votes.length}{" "}
                {this.props.votes.length === 1 ? "vote" : "votes"}
              </p>
              <div className="grav-c-board-card__buttons">
                <VoteButton handleVoteClick={this._handleVoteClick} hasVoted={this.state.hasVoted}/>
                <button onClick={this._handleDelete}>Delete</button>
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}
