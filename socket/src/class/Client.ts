import ClientImportData from "../interface/ClientImportData";
import ClientExportData from "../interface/ClientExportData";
import * as SocketIO from 'socket.io';

class Client {
    public server: SocketIO.Namespace;
    public socket: SocketIO.Socket;
    public token: string;
    public name: string;
    public character: string;
    public position: { x: number, y: number } = { x: 0, y: 0 };
    public vector: { x: number, y: number } = { x: 0, y: 0 };
    public score: number = 0;

    constructor(socket: SocketIO.Socket, client: ClientImportData) {
        this.socket = socket;
        this.token = client.token;
        this.name = client.name;
        this.character = client.character;
        this.socket.on('touch', this.touch.bind(this))
    }

    public update(dt: number): void {
        this.position.x += dt * this.vector.x;
        this.position.y += dt * this.vector.y;
    }

    public touch(position: { x: number, y: number }): void {

    }

    public get export(): ClientExportData {
        return {
            token: this.token,
            name: this.name,
            character: this.character,
            position: this.position,
            vector: this.vector,
            score: this.score
        };
    }
}

export default Client;