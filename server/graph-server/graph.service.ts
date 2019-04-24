import { GraphService } from "./graph.service.interface";
import { GraphQLServer } from "graphql-yoga";
import { prisma } from "./generated/prisma-client";
import { getUser, Context } from "./utils";
import { ContextParameters } from "graphql-yoga/dist/types";
import { buildSchema } from "type-graphql";
import CardResolvers from "./resolvers/cardResolver";
import UserResolvers from "./resolvers/userResolver";
const config = {
  appSecret: process.env.APP_SECRET || "mysecret"
};

export default class graphService implements GraphService {
  async init() {
    const schema = await buildSchema({
      resolvers: [CardResolvers, UserResolvers],
      emitSchemaFile: false,
      validate: true
    });
    const server = new GraphQLServer({
      schema,
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
