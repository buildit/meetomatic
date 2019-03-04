import { createServer, Server } from 'http';
import * as express from '../node_modules/express';
import * as socketIo from '../node_modules/socket.io';
import { Message } from './model/message';
import * as next from '../node_modules/next';

export class MeetoMaticServer {
    public static readonly PORT:number = 3000;
    private app: express.Application;
    private server: Server;
    private io: socketIo.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
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
                socket.emit('now', {
                    message: 'zeit'
                });

                console.log('Connected client on port %s.', this.port);
                socket.on('message', (m: Message) => {
                    console.log('[server](message): %s', JSON.stringify(m));
                    this.io.emit('message', m);
                });

                socket.on('disconnect', () => {
                    console.log('Client disconnected');
                });
            });

        });
    }

    public getApp(): express.Application {
        return this.app;
    }

}