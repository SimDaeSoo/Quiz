import Dictionary from '../interface/Dictionary';
import ClientImportData from '../interface/ClientImportData';
import ClientExportData from "../interface/ClientExportData";
import Client from './Client';
import * as SocketIO from 'socket.io';
import GameLogic from './GameLogic';

class GameRoom {
    public server: SocketIO.Namespace;
    public quizID: string;
    public id: number;
    public owner: string;
    public map: { sx: number, sy: number, ex: number, ey: number } = { sx: 0, sy: 0, ex: 1500, ey: 750 };
    public userDictionary: Dictionary<Client> = {};
    public logic: GameLogic = new GameLogic();

    constructor(quizID: string, id: number) {
        this.quizID = quizID;
        this.id = id;

        this.logic.setUsers(this.userDictionary);
        this.logic.start();
    }

    public get export(): RoomExportData {
        return {
            id: this.id,
            quizID: this.quizID,
            owner: this.owner,
            users: this.userExportDatas,
            map: this.map
        };
    }

    public setServer(server: SocketIO.Server): void {
        this.server = server.to(this.id.toString());
    }

    public reConnect(socket: SocketIO.Socket, token: string): void {
        socket.join(this.id.toString());
        this.userDictionary[token].reConnect(socket);
    }

    public join(socket: SocketIO.Socket, client: ClientImportData): void {
        socket.join(this.id.toString());
        this.userDictionary[client.token] = new Client(socket, client);
        this.userDictionary[client.token].server = this.server;
        this.server.emit('createObject', this.userDictionary[client.token].export);
    }

    public leave(socket: SocketIO.Socket): void {
        for (let token in this.userDictionary) {
            const user: Client = this.userDictionary[token];

            if (user.socket.id === socket.id) {
                socket.disconnect();
                delete this.userDictionary[token];
            }
        }
    }

    public destroy(): void {
        // 모든 소켓 제거, 모든 이벤트 리스너 제거 데이터 연동 제거 등..
    }

    public setOwner(client: ClientImportData): void {
        this.owner = client.token;
    }

    public get userExportDatas(): Dictionary<ClientExportData> {
        const result: Dictionary<ClientExportData> = {};

        for (let token in this.userDictionary) {
            const user: Client = this.userDictionary[token];
            result[token] = user.export;
        }

        return result;
    }
}

interface RoomExportData {
    id: number;
    quizID: string;
    owner: string;
    users: Dictionary<ClientExportData>;
    map: { sx: number, sy: number, ex: number, ey: number };
}

export default GameRoom;