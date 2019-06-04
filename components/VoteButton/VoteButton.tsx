import * as React from 'react';

interface Props {
  handleVoteClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
  hasVoted: boolean
}

export default function Toggle(Props: Props) {
  return <button onClick={Props.handleVoteClick}>👍 Vote {Props.hasVoted ? "✅" : null}</button>
}