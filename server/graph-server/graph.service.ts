import { GraphService } from "./graph.service.interface";
import { ApolloServer } from "apollo-server";
import { prisma } from "./generated/prisma-client";
import { getSystemUser, Context } from "./utils";
import { buildSchema } from "type-graphql";
import CardResolvers from "./resolvers/cardResolver";
import UserResolvers from "./resolvers/userResolver";
import BoardResolvers from "./resolvers/boardResolvers";
import ColumnResolvers from "./resolvers/columnResolvers";

const config = {
  appSecret: process.env.APP_SECRET || "mysecret"
};

export default class graphService implements GraphService {
  async init() {
    const schema = await buildSchema({
      resolvers: [
        CardResolvers,
        UserResolvers,
        BoardResolvers,
        ColumnResolvers
      ],
      emitSchemaFile: true,
      validate: true
    });
    const server = new ApolloServer({
      schema,
      context: async function(context) {
        const result: Context = {
          ...context,
          prisma,
          config,
          user: null
        };
        // Note: Should this be in middleware?
        // Note: We are going with anon acces for now, so just attach everything to the system user for now
        result.user = await getSystemUser(result);
        return result;
      }
    });

    server.listen().then(({ url }) => {
      console.log(`Server is running on ${url}`);
    });
  }

  start(): void {}
}
