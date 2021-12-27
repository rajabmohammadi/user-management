import dotenv from 'dotenv';
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}
import express from 'express';
import * as http from 'http';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './app/users/users.routes.config';
import debug from 'debug';
import helmet from 'helmet';
import mongooseService from "./common/services/mongoose.service";
import path from "path";
import jwt from "jsonwebtoken";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'common')));
//make route
routes.push(new UsersRoutes(app));

const runningMessage = `Server running at http://localhost:${process.env.PORT}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});
server.listen(process.env.PORT, () => {
    mongooseService;
    console.log(runningMessage);
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });

});

