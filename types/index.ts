export interface CardState {
  id: string;
  description: string;
  column: string;
}

export interface ColumnState {
  id: string;
  name: string;
  cards: CardState[];
}
