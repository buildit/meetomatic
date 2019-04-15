import { GraphService } from "./graph.service.interface";
import { GraphQLServer } from "graphql-yoga";
import { prisma } from "./generated/prisma-client";
import resolvers from "./resolvers";
import { getUser, Context } from "./utils";
import { ContextParameters } from "graphql-yoga/dist/types";

// import { rule, shield, not } from "graphql-shield";

const config = {
  appSecret: process.env.APP_SECRET || "mysecret"
};

export default class graphService implements GraphService {
  init(): void {
    const server = new GraphQLServer({
      typeDefs: "./server/graph-server/schema.graphql",
      resolvers,
      context: async function(context: ContextParameters) {
        const result: Context = {
          ...context,
          prisma,
          config,
          user: null
        };
        // Note: Should this be in middleware?
        result.user = await getUser(result);
        return result;
      }
    });

    server.start(() =>
      console.log(`Server is running on http://localhost:4000`)
    );
  }

  start(): void {}
}
