import { createServer, Server } from 'http';
import * as express from '../node_modules/express';
import * as socketIo from '../node_modules/socket.io';
import * as next from '../node_modules/next';
import { SocketService } from './handlers/socket/socket.handler.interface';
import {injectable, inject} from "tsyringe";


@injectable()
export class MeetoMaticServer {
    public static readonly PORT:number = 3000;
    private app: express.Application;
    private server: Server;
    private io: socketIo.Server;
    private port: string | number;
    private socketHandler: SocketService;

    constructor(@inject("SocketService")  service: SocketService) {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();

        this.socketHandler = service;
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }


    private config(): void {
        this.port = process.env.PORT || MeetoMaticServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        const dev = process.env.NODE_ENV = 'production';
        const nextApp = next({dev});
        const handle = nextApp.getRequestHandler();

        nextApp.prepare()
         .then(() => {
            this.app.get('*', (req, res) => {
                return handle(req, res)
            })

            this.server.listen(this.port, () => {
                console.log('Running server on port %s', this.port);
            });

            this.io.on('connect', (socket: any) => {
                this.socketHandler.init(socket);
            });

        });
    }

    public getApp(): express.Application {
        return this.app;
    }

}