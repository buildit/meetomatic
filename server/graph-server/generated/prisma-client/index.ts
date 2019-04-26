// Code generated by Prisma (prisma@1.30.1). DO NOT EDIT.
// Please don't change this file manually but run `prisma generate` to update it.
// For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

import { DocumentNode } from "graphql";
import {
  makePrismaClientClass,
  BaseClientOptions,
  Model
} from "prisma-client-lib";
import { typeDefs } from "./prisma-schema";

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export interface Exists {
  board: (where?: BoardWhereInput) => Promise<boolean>;
  card: (where?: CardWhereInput) => Promise<boolean>;
  user: (where?: UserWhereInput) => Promise<boolean>;
}

export interface Node {}

export type FragmentableArray<T> = Promise<Array<T>> & Fragmentable;

export interface Fragmentable {
  $fragment<T>(fragment: string | DocumentNode): Promise<T>;
}

export interface Prisma {
  $exists: Exists;
  $graphql: <T = any>(
    query: string,
    variables?: { [key: string]: any }
  ) => Promise<T>;

  /**
   * Queries
   */

  board: (where: BoardWhereUniqueInput) => BoardPromise;
  boards: (
    args?: {
      where?: BoardWhereInput;
      orderBy?: BoardOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<Board>;
  boardsConnection: (
    args?: {
      where?: BoardWhereInput;
      orderBy?: BoardOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => BoardConnectionPromise;
  card: (where: CardWhereUniqueInput) => CardPromise;
  cards: (
    args?: {
      where?: CardWhereInput;
      orderBy?: CardOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<Card>;
  cardsConnection: (
    args?: {
      where?: CardWhereInput;
      orderBy?: CardOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => CardConnectionPromise;
  user: (where: UserWhereUniqueInput) => UserPromise;
  users: (
    args?: {
      where?: UserWhereInput;
      orderBy?: UserOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<User>;
  usersConnection: (
    args?: {
      where?: UserWhereInput;
      orderBy?: UserOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => UserConnectionPromise;
  node: (args: { id: ID_Output }) => Node;

  /**
   * Mutations
   */

  createBoard: (data: BoardCreateInput) => BoardPromise;
  updateBoard: (
    args: { data: BoardUpdateInput; where: BoardWhereUniqueInput }
  ) => BoardPromise;
  updateManyBoards: (
    args: { data: BoardUpdateManyMutationInput; where?: BoardWhereInput }
  ) => BatchPayloadPromise;
  upsertBoard: (
    args: {
      where: BoardWhereUniqueInput;
      create: BoardCreateInput;
      update: BoardUpdateInput;
    }
  ) => BoardPromise;
  deleteBoard: (where: BoardWhereUniqueInput) => BoardPromise;
  deleteManyBoards: (where?: BoardWhereInput) => BatchPayloadPromise;
  createCard: (data: CardCreateInput) => CardPromise;
  updateCard: (
    args: { data: CardUpdateInput; where: CardWhereUniqueInput }
  ) => CardPromise;
  updateManyCards: (
    args: { data: CardUpdateManyMutationInput; where?: CardWhereInput }
  ) => BatchPayloadPromise;
  upsertCard: (
    args: {
      where: CardWhereUniqueInput;
      create: CardCreateInput;
      update: CardUpdateInput;
    }
  ) => CardPromise;
  deleteCard: (where: CardWhereUniqueInput) => CardPromise;
  deleteManyCards: (where?: CardWhereInput) => BatchPayloadPromise;
  createUser: (data: UserCreateInput) => UserPromise;
  updateUser: (
    args: { data: UserUpdateInput; where: UserWhereUniqueInput }
  ) => UserPromise;
  updateManyUsers: (
    args: { data: UserUpdateManyMutationInput; where?: UserWhereInput }
  ) => BatchPayloadPromise;
  upsertUser: (
    args: {
      where: UserWhereUniqueInput;
      create: UserCreateInput;
      update: UserUpdateInput;
    }
  ) => UserPromise;
  deleteUser: (where: UserWhereUniqueInput) => UserPromise;
  deleteManyUsers: (where?: UserWhereInput) => BatchPayloadPromise;

  /**
   * Subscriptions
   */

  $subscribe: Subscription;
}

export interface Subscription {
  board: (
    where?: BoardSubscriptionWhereInput
  ) => BoardSubscriptionPayloadSubscription;
  card: (
    where?: CardSubscriptionWhereInput
  ) => CardSubscriptionPayloadSubscription;
  user: (
    where?: UserSubscriptionWhereInput
  ) => UserSubscriptionPayloadSubscription;
}

export interface ClientConstructor<T> {
  new (options?: BaseClientOptions): T;
}

/**
 * Types
 */

export type MutationType = "CREATED" | "UPDATED" | "DELETED";

export type BoardOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "name_ASC"
  | "name_DESC"
  | "password_ASC"
  | "password_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export type CardOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "description_ASC"
  | "description_DESC"
  | "column_ASC"
  | "column_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export type UserOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "name_ASC"
  | "name_DESC"
  | "email_ASC"
  | "email_DESC"
  | "password_ASC"
  | "password_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export interface UserUpdateOneInput {
  create?: UserCreateInput;
  update?: UserUpdateDataInput;
  upsert?: UserUpsertNestedInput;
  delete?: Boolean;
  disconnect?: Boolean;
  connect?: UserWhereUniqueInput;
}

export type BoardWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export interface UserWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  name?: String;
  name_not?: String;
  name_in?: String[] | String;
  name_not_in?: String[] | String;
  name_lt?: String;
  name_lte?: String;
  name_gt?: String;
  name_gte?: String;
  name_contains?: String;
  name_not_contains?: String;
  name_starts_with?: String;
  name_not_starts_with?: String;
  name_ends_with?: String;
  name_not_ends_with?: String;
  email?: String;
  email_not?: String;
  email_in?: String[] | String;
  email_not_in?: String[] | String;
  email_lt?: String;
  email_lte?: String;
  email_gt?: String;
  email_gte?: String;
  email_contains?: String;
  email_not_contains?: String;
  email_starts_with?: String;
  email_not_starts_with?: String;
  email_ends_with?: String;
  email_not_ends_with?: String;
  password?: String;
  password_not?: String;
  password_in?: String[] | String;
  password_not_in?: String[] | String;
  password_lt?: String;
  password_lte?: String;
  password_gt?: String;
  password_gte?: String;
  password_contains?: String;
  password_not_contains?: String;
  password_starts_with?: String;
  password_not_starts_with?: String;
  password_ends_with?: String;
  password_not_ends_with?: String;
  AND?: UserWhereInput[] | UserWhereInput;
  OR?: UserWhereInput[] | UserWhereInput;
  NOT?: UserWhereInput[] | UserWhereInput;
}

export interface BoardSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: BoardWhereInput;
  AND?: BoardSubscriptionWhereInput[] | BoardSubscriptionWhereInput;
  OR?: BoardSubscriptionWhereInput[] | BoardSubscriptionWhereInput;
  NOT?: BoardSubscriptionWhereInput[] | BoardSubscriptionWhereInput;
}

export interface BoardWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  name?: String;
  name_not?: String;
  name_in?: String[] | String;
  name_not_in?: String[] | String;
  name_lt?: String;
  name_lte?: String;
  name_gt?: String;
  name_gte?: String;
  name_contains?: String;
  name_not_contains?: String;
  name_starts_with?: String;
  name_not_starts_with?: String;
  name_ends_with?: String;
  name_not_ends_with?: String;
  password?: String;
  password_not?: String;
  password_in?: String[] | String;
  password_not_in?: String[] | String;
  password_lt?: String;
  password_lte?: String;
  password_gt?: String;
  password_gte?: String;
  password_contains?: String;
  password_not_contains?: String;
  password_starts_with?: String;
  password_not_starts_with?: String;
  password_ends_with?: String;
  password_not_ends_with?: String;
  AND?: BoardWhereInput[] | BoardWhereInput;
  OR?: BoardWhereInput[] | BoardWhereInput;
  NOT?: BoardWhereInput[] | BoardWhereInput;
}

export interface UserUpdateInput {
  name?: String;
  email?: String;
  password?: String;
}

export interface UserCreateInput {
  id?: ID_Input;
  name: String;
  email: String;
  password: String;
}

export interface UserUpsertNestedInput {
  update: UserUpdateDataInput;
  create: UserCreateInput;
}

export interface UserCreateOneInput {
  create?: UserCreateInput;
  connect?: UserWhereUniqueInput;
}

export interface UserUpdateDataInput {
  name?: String;
  email?: String;
  password?: String;
}

export interface CardCreateInput {
  id?: ID_Input;
  description: String;
  owner?: UserCreateOneInput;
  column: String;
}

export interface CardUpdateInput {
  description?: String;
  owner?: UserUpdateOneInput;
  column?: String;
}

export type UserWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export interface UserUpdateManyMutationInput {
  name?: String;
  email?: String;
  password?: String;
}

export interface BoardCreateInput {
  name: String;
  password: String;
}

export interface BoardUpdateInput {
  name?: String;
  password?: String;
}

export interface BoardUpdateManyMutationInput {
  name?: String;
  password?: String;
}

export interface CardSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: CardWhereInput;
  AND?: CardSubscriptionWhereInput[] | CardSubscriptionWhereInput;
  OR?: CardSubscriptionWhereInput[] | CardSubscriptionWhereInput;
  NOT?: CardSubscriptionWhereInput[] | CardSubscriptionWhereInput;
}

export interface CardUpdateManyMutationInput {
  description?: String;
  column?: String;
}

export interface CardWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  description?: String;
  description_not?: String;
  description_in?: String[] | String;
  description_not_in?: String[] | String;
  description_lt?: String;
  description_lte?: String;
  description_gt?: String;
  description_gte?: String;
  description_contains?: String;
  description_not_contains?: String;
  description_starts_with?: String;
  description_not_starts_with?: String;
  description_ends_with?: String;
  description_not_ends_with?: String;
  owner?: UserWhereInput;
  column?: String;
  column_not?: String;
  column_in?: String[] | String;
  column_not_in?: String[] | String;
  column_lt?: String;
  column_lte?: String;
  column_gt?: String;
  column_gte?: String;
  column_contains?: String;
  column_not_contains?: String;
  column_starts_with?: String;
  column_not_starts_with?: String;
  column_ends_with?: String;
  column_not_ends_with?: String;
  createdAt?: DateTimeInput;
  createdAt_not?: DateTimeInput;
  createdAt_in?: DateTimeInput[] | DateTimeInput;
  createdAt_not_in?: DateTimeInput[] | DateTimeInput;
  createdAt_lt?: DateTimeInput;
  createdAt_lte?: DateTimeInput;
  createdAt_gt?: DateTimeInput;
  createdAt_gte?: DateTimeInput;
  updatedAt?: DateTimeInput;
  updatedAt_not?: DateTimeInput;
  updatedAt_in?: DateTimeInput[] | DateTimeInput;
  updatedAt_not_in?: DateTimeInput[] | DateTimeInput;
  updatedAt_lt?: DateTimeInput;
  updatedAt_lte?: DateTimeInput;
  updatedAt_gt?: DateTimeInput;
  updatedAt_gte?: DateTimeInput;
  AND?: CardWhereInput[] | CardWhereInput;
  OR?: CardWhereInput[] | CardWhereInput;
  NOT?: CardWhereInput[] | CardWhereInput;
}

export interface UserSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: UserWhereInput;
  AND?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput;
  OR?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput;
  NOT?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput;
}

export type CardWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export interface NodeNode {
  id: ID_Output;
}

export interface AggregateUser {
  count: Int;
}

export interface AggregateUserPromise
  extends Promise<AggregateUser>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateUserSubscription
  extends Promise<AsyncIterator<AggregateUser>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface BoardEdge {
  node: Board;
  cursor: String;
}

export interface BoardEdgePromise extends Promise<BoardEdge>, Fragmentable {
  node: <T = BoardPromise>() => T;
  cursor: () => Promise<String>;
}

export interface BoardEdgeSubscription
  extends Promise<AsyncIterator<BoardEdge>>,
    Fragmentable {
  node: <T = BoardSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface UserPreviousValues {
  id: ID_Output;
  name: String;
  email: String;
  password: String;
}

export interface UserPreviousValuesPromise
  extends Promise<UserPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  name: () => Promise<String>;
  email: () => Promise<String>;
  password: () => Promise<String>;
}

export interface UserPreviousValuesSubscription
  extends Promise<AsyncIterator<UserPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  name: () => Promise<AsyncIterator<String>>;
  email: () => Promise<AsyncIterator<String>>;
  password: () => Promise<AsyncIterator<String>>;
}

export interface AggregateBoard {
  count: Int;
}

export interface AggregateBoardPromise
  extends Promise<AggregateBoard>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateBoardSubscription
  extends Promise<AsyncIterator<AggregateBoard>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface CardSubscriptionPayload {
  mutation: MutationType;
  node: Card;
  updatedFields: String[];
  previousValues: CardPreviousValues;
}

export interface CardSubscriptionPayloadPromise
  extends Promise<CardSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = CardPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = CardPreviousValuesPromise>() => T;
}

export interface CardSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<CardSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = CardSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = CardPreviousValuesSubscription>() => T;
}

export interface UserEdge {
  node: User;
  cursor: String;
}

export interface UserEdgePromise extends Promise<UserEdge>, Fragmentable {
  node: <T = UserPromise>() => T;
  cursor: () => Promise<String>;
}

export interface UserEdgeSubscription
  extends Promise<AsyncIterator<UserEdge>>,
    Fragmentable {
  node: <T = UserSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface UserConnection {
  pageInfo: PageInfo;
  edges: UserEdge[];
}

export interface UserConnectionPromise
  extends Promise<UserConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<UserEdge>>() => T;
  aggregate: <T = AggregateUserPromise>() => T;
}

export interface UserConnectionSubscription
  extends Promise<AsyncIterator<UserConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<UserEdgeSubscription>>>() => T;
  aggregate: <T = AggregateUserSubscription>() => T;
}

export interface BatchPayload {
  count: Long;
}

export interface BatchPayloadPromise
  extends Promise<BatchPayload>,
    Fragmentable {
  count: () => Promise<Long>;
}

export interface BatchPayloadSubscription
  extends Promise<AsyncIterator<BatchPayload>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Long>>;
}

export interface AggregateCard {
  count: Int;
}

export interface AggregateCardPromise
  extends Promise<AggregateCard>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateCardSubscription
  extends Promise<AsyncIterator<AggregateCard>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface PageInfo {
  hasNextPage: Boolean;
  hasPreviousPage: Boolean;
  startCursor?: String;
  endCursor?: String;
}

export interface PageInfoPromise extends Promise<PageInfo>, Fragmentable {
  hasNextPage: () => Promise<Boolean>;
  hasPreviousPage: () => Promise<Boolean>;
  startCursor: () => Promise<String>;
  endCursor: () => Promise<String>;
}

export interface PageInfoSubscription
  extends Promise<AsyncIterator<PageInfo>>,
    Fragmentable {
  hasNextPage: () => Promise<AsyncIterator<Boolean>>;
  hasPreviousPage: () => Promise<AsyncIterator<Boolean>>;
  startCursor: () => Promise<AsyncIterator<String>>;
  endCursor: () => Promise<AsyncIterator<String>>;
}

export interface CardConnection {
  pageInfo: PageInfo;
  edges: CardEdge[];
}

export interface CardConnectionPromise
  extends Promise<CardConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<CardEdge>>() => T;
  aggregate: <T = AggregateCardPromise>() => T;
}

export interface CardConnectionSubscription
  extends Promise<AsyncIterator<CardConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<CardEdgeSubscription>>>() => T;
  aggregate: <T = AggregateCardSubscription>() => T;
}

export interface User {
  id: ID_Output;
  name: String;
  email: String;
  password: String;
}

export interface UserPromise extends Promise<User>, Fragmentable {
  id: () => Promise<ID_Output>;
  name: () => Promise<String>;
  email: () => Promise<String>;
  password: () => Promise<String>;
}

export interface UserSubscription
  extends Promise<AsyncIterator<User>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  name: () => Promise<AsyncIterator<String>>;
  email: () => Promise<AsyncIterator<String>>;
  password: () => Promise<AsyncIterator<String>>;
}

export interface BoardPreviousValues {
  id: ID_Output;
  name: String;
  password: String;
}

export interface BoardPreviousValuesPromise
  extends Promise<BoardPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  name: () => Promise<String>;
  password: () => Promise<String>;
}

export interface BoardPreviousValuesSubscription
  extends Promise<AsyncIterator<BoardPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  name: () => Promise<AsyncIterator<String>>;
  password: () => Promise<AsyncIterator<String>>;
}

export interface BoardSubscriptionPayload {
  mutation: MutationType;
  node: Board;
  updatedFields: String[];
  previousValues: BoardPreviousValues;
}

export interface BoardSubscriptionPayloadPromise
  extends Promise<BoardSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = BoardPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = BoardPreviousValuesPromise>() => T;
}

export interface BoardSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<BoardSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = BoardSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = BoardPreviousValuesSubscription>() => T;
}

export interface CardPreviousValues {
  id: ID_Output;
  description: String;
  column: String;
  createdAt: DateTimeOutput;
  updatedAt: DateTimeOutput;
}

export interface CardPreviousValuesPromise
  extends Promise<CardPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  description: () => Promise<String>;
  column: () => Promise<String>;
  createdAt: () => Promise<DateTimeOutput>;
  updatedAt: () => Promise<DateTimeOutput>;
}

export interface CardPreviousValuesSubscription
  extends Promise<AsyncIterator<CardPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  description: () => Promise<AsyncIterator<String>>;
  column: () => Promise<AsyncIterator<String>>;
  createdAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  updatedAt: () => Promise<AsyncIterator<DateTimeOutput>>;
}

export interface BoardConnection {
  pageInfo: PageInfo;
  edges: BoardEdge[];
}

export interface BoardConnectionPromise
  extends Promise<BoardConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<BoardEdge>>() => T;
  aggregate: <T = AggregateBoardPromise>() => T;
}

export interface BoardConnectionSubscription
  extends Promise<AsyncIterator<BoardConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<BoardEdgeSubscription>>>() => T;
  aggregate: <T = AggregateBoardSubscription>() => T;
}

export interface Card {
  id: ID_Output;
  description: String;
  column: String;
  createdAt: DateTimeOutput;
  updatedAt: DateTimeOutput;
}

export interface CardPromise extends Promise<Card>, Fragmentable {
  id: () => Promise<ID_Output>;
  description: () => Promise<String>;
  owner: <T = UserPromise>() => T;
  column: () => Promise<String>;
  createdAt: () => Promise<DateTimeOutput>;
  updatedAt: () => Promise<DateTimeOutput>;
}

export interface CardSubscription
  extends Promise<AsyncIterator<Card>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  description: () => Promise<AsyncIterator<String>>;
  owner: <T = UserSubscription>() => T;
  column: () => Promise<AsyncIterator<String>>;
  createdAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  updatedAt: () => Promise<AsyncIterator<DateTimeOutput>>;
}

export interface Board {
  id: ID_Output;
  name: String;
  password: String;
}

export interface BoardPromise extends Promise<Board>, Fragmentable {
  id: () => Promise<ID_Output>;
  name: () => Promise<String>;
  password: () => Promise<String>;
}

export interface BoardSubscription
  extends Promise<AsyncIterator<Board>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  name: () => Promise<AsyncIterator<String>>;
  password: () => Promise<AsyncIterator<String>>;
}

export interface CardEdge {
  node: Card;
  cursor: String;
}

export interface CardEdgePromise extends Promise<CardEdge>, Fragmentable {
  node: <T = CardPromise>() => T;
  cursor: () => Promise<String>;
}

export interface CardEdgeSubscription
  extends Promise<AsyncIterator<CardEdge>>,
    Fragmentable {
  node: <T = CardSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface UserSubscriptionPayload {
  mutation: MutationType;
  node: User;
  updatedFields: String[];
  previousValues: UserPreviousValues;
}

export interface UserSubscriptionPayloadPromise
  extends Promise<UserSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = UserPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = UserPreviousValuesPromise>() => T;
}

export interface UserSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<UserSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = UserSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = UserPreviousValuesSubscription>() => T;
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean;

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number;
export type ID_Output = string;

export type Long = string;

/*
DateTime scalar input type, allowing Date
*/
export type DateTimeInput = Date | string;

/*
DateTime scalar output type, which is always a string
*/
export type DateTimeOutput = string;

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number;

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string;

/**
 * Model Metadata
 */

export const models: Model[] = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Card",
    embedded: false
  },
  {
    name: "Board",
    embedded: false
  }
];

/**
 * Type Defs
 */

export const Prisma = makePrismaClientClass<ClientConstructor<Prisma>>({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
export const prisma = new Prisma();