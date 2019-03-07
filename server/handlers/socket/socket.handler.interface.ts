export interface SocketService {
    init(socket:any): void;
    hostNewRoom(): void;
    joinRoom(): void;
}