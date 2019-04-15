import "reflect-metadata";
import { MeetoMaticServer } from "./server";
import { container } from "tsyringe";
import SocketHandler from "./handlers/socket/socket.handler";
import GraphService from "./graph-server/graph.service";

container.register("SocketService", {
  useClass: SocketHandler
});

container.register("GraphService", {
  useClass: GraphService
});

const app = container.resolve(MeetoMaticServer);

export { app };
