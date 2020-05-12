import { Express, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as SocketIO from 'socket.io';
import * as ip from 'public-ip';
import { Server } from 'http';
import { Error } from '../interface/Server';
import axios, { AxiosResponse } from 'axios';

interface Auth {
    jwt: string;
}
class GameServer {
    private IP!: string;
    private port!: number;
    private server!: Server;
    private io!: SocketIO.Server;
    private application!: Express;
    private token: string;

    public async initialize(): Promise<void> {
        this.IP = await ip.v4();
        this.application = express();
        this.middleware();
        this.routing();
    }

    private middleware(): void {
        this.application.use(bodyParser.json({ limit: '10mb' }));
        this.application.use(bodyParser.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }));

        // CORS 문제.
        this.application.all('*', (req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
            res.header('Access-Control-Allow-Methods', 'POST,GET');
            next();
        });
    }

    private routing(): void { }

    public open(port: number): void {
        this.port = port;
        this.server = this.application.listen(this.port);

        this.server.once('error', (err: Error): void => {
            if (err.code === 'EADDRINUSE') {
                this.close();
                this.open(++this.port);
            }
        });

        this.server.once('listening', (): void => {
            console.log(`[${new Date()}] server is running http://${this.IP}:${this.port}`);
            this.createSocketServer();
        });
    }

    private createSocketServer(): void {
        try {
            this.io = SocketIO(this.server, { serveClient: false });
            this.io.on('connection', (socket: SocketIO.Socket): void => { this.connect(socket); });
        } catch (error) {
            console.log(error);
        }
    }

    private connect(socket: SocketIO.Socket): void {
        socket.on('disconnect', (): void => { this.disconnect(socket); });
        socket.on('_ping', (dt): void => { socket.emit('_pong', dt); });
    }

    private disconnect(socket: SocketIO.Socket): void {
    }

    public close(): void {
        this.server.close();
    }

    public async certification(identifier: string, password: string): Promise<void> {
        try {
            const response: AxiosResponse<Auth> = await axios.post(`${process.env.SERVER_ADDRESS}/api/auth/local`, { identifier, password });
            const auth: Auth = response.data;
            this.token = auth.jwt;
            console.log(`[${new Date}] Certification Success : ${this.token}`);
        } catch (e) {
            console.log(`[${new Date}] Certification Error!..`);
        }
    }
}

export default GameServer;