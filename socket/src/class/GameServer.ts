import { Express, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as SocketIO from 'socket.io';
import * as ip from 'public-ip';
import { Server } from 'http';
import { Error } from '../interface/Server';
import axios, { AxiosResponse } from 'axios';
import GameRoom from './GameRoom';
import ClientImportData from '../interface/ClientImportData';

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

    public rooms: Array<GameRoom> = [];

    public async initialize(): Promise<void> {
        this.IP = await ip.v4();
        this.application = express();
        this.middleware();
        this.routing();
    }

    private middleware(): void {
        this.application.use(bodyParser.json({ limit: '10mb' }));
        this.application.use(bodyParser.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }));

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
        socket.on('_ping', (dt): void => { socket.emit('_pong', dt); });
        socket.on('disconnect', (): void => { this.disconnect(socket); });
        socket.on('applyCreateRoom', (quizID: string, client: ClientImportData): void => { this.createRoom(socket, quizID, client) });
        socket.on('getRoom', (): void => { socket.emit('setRoom', this.rooms.map(room => room.export)); });
        socket.on('cetrification', (token: string): void => { this.certificationUser(socket, token); });
        socket.on('applyJoinRoom', (client: ClientImportData): void => {
            if (this.rooms.length) {
                this.rooms[0].join(socket, client);
                socket.emit('joinedRoom', this.rooms[0].export);
            }
        });
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

    private get uniqueRoomID(): number {
        let id: number;

        for (let i = 0; i < this.rooms.length; i++) {
            let flag: boolean = true;
            for (const room of this.rooms) {
                if (room.id === i) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                id = i;
                break;
            }
        }

        if (id === undefined) {
            id = this.rooms.length;
        }

        return id;
    }

    private createRoom(socket: SocketIO.Socket, quizID: string, client: ClientImportData): void {
        const newRoom: GameRoom = new GameRoom(quizID, this.uniqueRoomID);
        newRoom.setServer(this.io);
        newRoom.setOwner(client);
        newRoom.join(socket, client);
        this.rooms.push(newRoom);
        socket.emit('joinedRoom', newRoom.export);
    }

    private certificationUser(socket: SocketIO.Socket, token: string): void {
        for (const room of this.rooms) {
            if (room.userDictionary[token]) {
                room.reConnect(socket, token);
                socket.emit('joinedRoom', room.export);
                break;
            }
        }
    }
}



export default GameServer;