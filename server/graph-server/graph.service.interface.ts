// import { GraphQLServer } from 'graphql-yoga';

export interface GraphService {
    init(): void;
    start(): void;
}