import React from "react";
import CardVoteInterface from "./CardVote.interface";

export interface State {
  hasVoted: any;
}

export default class CardVote extends React.Component<CardVoteInterface, State, {}> {
  constructor(props: CardVoteInterface) {
    super(props);

    this.state = {
      hasVoted: false
    }

    this.handleVotes = this.handleVotes.bind(this);
  }

  handleVotes(e) {
    this.props.handleVotes(e);

    this.setState({
      hasVoted: true
    })
  }

    
  render() {
    return this.state.hasVoted ? (
      this.props.voteCount > 1 ? (
        "votes"
      ) : (
        "vote"
      )
    ) : (
      <button type="button" onClick={this.handleVotes} value={this.props.cardId}>Vote</button>
    );
  }
}
