import mongoose from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

class MongooseService {
    constructor() {
        mongoose.connect('mongodb://localhost:27017/test').then(() =>
            console.log("connected to mongodb")
        ).catch((err) =>
            console.log("MongoDB connection unsuccessful", err)
        )
    }
}
export default new MongooseService();
