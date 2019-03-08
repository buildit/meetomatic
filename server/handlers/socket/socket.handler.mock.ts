import {SocketService} from "./socket.handler.interface";

export class SocketHandlerTest implements SocketService {
    private socket: any;

    init(socket: any): void {
        this.socket = socket;

        this.socket.emit('connected', {message: 'You are connected to the test socket'});
    }

    hostNewRoom(): void {
        
    }

    joinRoom(): void {

    }

}