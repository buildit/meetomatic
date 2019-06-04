export interface VoteState {
  id: string;
}

export interface CardState {
  id: string;
  description: string;
  votes: VoteState[];
}

export interface ColumnState {
  id: string;
  name: string;
  cards?: CardState[];
}

export interface UserState {
  id: string;
  name: string;
  email: string;
}
export interface BoardState {
  id: string;
  name: string;
  owner: UserState;
  columns?: ColumnState[];
}
