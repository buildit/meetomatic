import { Card, User } from '.';

export class Room extends Card{
    constructor(from: User, content: string) {
        super(from, content);
    }
}