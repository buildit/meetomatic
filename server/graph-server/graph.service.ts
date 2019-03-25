import {GraphService} from "./graph.service.interface";
import { GraphQLServer } from 'graphql-yoga';
import { prisma } from './generated/prisma-client';
import resolvers  from "./resolvers";

export default class graphService implements GraphService {
    //private graphServer: GraphQLServer;

    init(): void {
        const server =  new GraphQLServer({
            typeDefs: './server/graph-server/schema.graphql',
            resolvers,
            context: request => ({
            ...request,
            prisma,
            }),
        });

        server.start(() => console.log(`Server is running on http://localhost:4000`))
   }

   start() : void {
  
   }

   
}