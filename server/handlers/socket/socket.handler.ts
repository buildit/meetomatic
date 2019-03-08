import {SocketService} from "./socket.handler.interface";

export default class SocketHandler implements SocketService{
    private socket: any;

    constructor(){
    }

    init(socket): void {
       this.socket = socket;

       this.socket.emit('connected', {message: 'You are connected'});

       //Room sockets
       this.socket.on('hostCreateNewRoom', this.hostNewRoom);

       //Joiner sockets 
       this.socket.on('disconnect', () => {console.log('Client disconnected');});
    }


    hostNewRoom(): void {
        
    }

    joinRoom(): void {

    }


}