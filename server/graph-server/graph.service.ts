import { GraphService } from "./graph.service.interface";
import { GraphQLServer } from "graphql-yoga";
import { prisma } from "./generated/prisma-client";
import resolvers from "./resolvers";

// import { rule, shield, not } from "graphql-shield";

const config = {
  appSecret: process.env.APP_SECRET || "mysecret"
};

export default class graphService implements GraphService {
  init(): void {
    const server = new GraphQLServer({
      typeDefs: "./server/graph-server/schema.graphql",
      resolvers,
      context: request => ({
        ...request,
        prisma,
        config
      })
    });

    server.start(() =>
      console.log(`Server is running on http://localhost:4000`)
    );
  }

  start(): void {}
}
