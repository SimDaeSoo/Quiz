import Dictionary from '../interface/Dictionary';
import ClientImportData from '../interface/ClientImportData';
import ClientExportData from "../interface/ClientExportData";
import Client from './Client';
import * as SocketIO from 'socket.io';
import GameLogic from './GameLogic';
import axios, { AxiosResponse } from 'axios';
import Quiz from '../interface/Quiz';
import Command from '../interface/Command';

class GameRoom {
    public title: string;
    public server: SocketIO.Namespace;
    public quizID: string;
    public id: number;
    public owner: string;
    public ownerSocket: SocketIO.Socket;
    public map: { sx: number, sy: number, ex: number, ey: number } = { sx: 0, sy: 0, ex: 2000, ey: 1000 };
    public userDictionary: Dictionary<Client> = {};
    public logic: GameLogic = new GameLogic();
    public started: boolean = false;
    private authToken: string = '';
    private quiz: Quiz;

    constructor(quizID: string, title: string, id: number) {
        this.quizID = quizID;
        this.id = id;
        this.title = title;
        this.logic.setUsers(this.userDictionary);
        this.logic.start();
    }

    public get export(): RoomExportData {
        return {
            id: this.id,
            quizID: this.quizID,
            owner: this.owner,
            users: this.userExportDatas,
            map: this.map,
            started: this.started
        };
    }

    public setServer(server: SocketIO.Server): void {
        this.server = server.to(`room${this.id}`);
    }

    public reConnect(socket: SocketIO.Socket, token: string): void {
        socket.join(`room${this.id}`);
        this.userDictionary[token].reConnect(socket);
        if (token === this.owner) {
            this.ownerSocket = socket;
            socket.on('ownerCommand', this.ownerCommand.bind(this));
        }
    }

    public join(socket: SocketIO.Socket, client: ClientImportData): void {
        if (this.started) return;
        socket.join(`room${this.id}`);
        if (client.token !== this.owner) {
            this.userDictionary[client.token] = new Client(socket, client, this.id);
            this.userDictionary[client.token].server = this.server;
            this.server.emit('createObject', this.userDictionary[client.token].export);
        } else {
            this.ownerSocket = socket;
            socket.on('ownerCommand', this.ownerCommand.bind(this));
        }
    }

    public leave(socket: SocketIO.Socket): void {
        if (this.started) return;
        for (let token in this.userDictionary) {
            const user: Client = this.userDictionary[token];

            if (user.socket.id === socket.id) {
                socket.removeAllListeners();
                socket.emit('disconnect');
                socket.disconnect(true);
                this.server.emit('destroyObject', this.userDictionary[token].export);
                delete this.userDictionary[token];
            }
        }

        if (socket.id === this.ownerSocket.id) {
            this.ownerSocket = undefined;
        }

        const length = Object.keys(this.userDictionary).length;
        if (!length && !this.ownerSocket) {
            this.logic.destroy();
            this.destroy(this);
        }
    }

    public destroy: (room: GameRoom) => void;
    public setDestroy(callback: (room: GameRoom) => void): void {
        this.destroy = callback;
    }

    public setOwner(client: ClientImportData): void {
        this.owner = client.token;
    }

    public setToken(token: string): void {
        this.authToken = token;
    }

    public async fetchQuiz(quizID: string): Promise<void> {
        const response: AxiosResponse<Quiz> = await axios.get(`${process.env.SERVER_ADDRESS}/api/quizzes/${quizID}`, { headers: { Authorization: `Bearer ${this.authToken}` } });
        const quiz: Quiz = response.data;
        this.quiz = quiz;
    }

    public get userExportDatas(): Dictionary<ClientExportData> {
        const result: Dictionary<ClientExportData> = {};

        for (let token in this.userDictionary) {
            const user: Client = this.userDictionary[token];
            result[token] = user.export;
        }

        return result;
    }

    private ownerCommand(command: Command): void {
        console.log('command emitted', command);
    }
}

interface RoomExportData {
    id: number;
    quizID: string;
    owner: string;
    users: Dictionary<ClientExportData>;
    map: { sx: number, sy: number, ex: number, ey: number };
    started: boolean;
}

export default GameRoom;