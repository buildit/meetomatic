import {DBService} from "./db.handler.interface";
import * as mongoose from 'mongoose';


export class MongoDBHandler implements DBService {

    

    init(): void {
        mongoose
        .connect(
            `mongodb+srv://${process.env.MONGO_USER}:${
                process.env.MONGO_PASSWORD
            }@cluster0-a7mxh.mongodb.net/test?retryWrites=true`
        );
    }

    add(data: any): void {
        
    }

    edit(id:number, data): void {

    }

    read(id: number) {

    }

    remove(id: number) {
        
    }

}