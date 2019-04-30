export default interface Card {
  id: string;
  index: number;
  title: string;
  newCardTitle: string;
  cards: Array<any>;
  addNewCard: any;
  handleCardChange: any;
  handleVotes: any;
}
