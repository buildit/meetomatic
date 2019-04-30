export default interface Card {
  cardId: string;
  title: string;
  date: string;
  votes: number;
  index: number;
  handleVotes: any;
}