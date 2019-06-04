import "reflect-metadata";
import { MeetoMaticServer } from './server';
import {container} from "tsyringe";
import SocketHandler from "./handlers/socket/socket.handler";

container.register(
    "SocketService", {
    useClass: SocketHandler
});


const app = container.resolve(MeetoMaticServer);

export { app };
