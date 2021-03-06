import * as express from "express";
import * as next from "next";
import { GraphService } from "./graph-server/graph.service.interface";
import { injectable, inject } from "tsyringe";

@injectable()
export class MeetoMaticServer {
  private server: express.Application;
  private port: string | number = 3000;
  private graphServer: GraphService;

  constructor(@inject("GraphService") graphService: GraphService) {
    this.config();
    this.createServer();
    this.listen();

    this.graphServer = graphService;
  }

  private createServer(): void {
    this.server = express();
  }

  private config(): void {
    this.port = process.env.PORT || this.port;
  }

  private listen(): void {
    const dev = process.env.NODE_ENV !== "production";
    const nextApp = next({ dev });
    const handle = nextApp.getRequestHandler();

    nextApp.prepare().then(() => {
      this.server.get("/board/create", (req, res) => {
        nextApp.render(req, res, "/createboard");
      });

      this.server.get("/board/:id", (req, res) => {
        nextApp.render(req, res, "/board", { id: req.params.id });
      });

      this.server.get("*", (req, res) => {
        return handle(req, res);
      });

      this.graphServer.init();

      this.server.listen(this.port, () => {
        console.log("Running server on port %s", this.port);
      });
    });
  }

  public getApp(): express.Application {
    return this.server;
  }
}
