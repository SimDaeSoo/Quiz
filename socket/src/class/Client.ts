import ClientImportData from "../interface/ClientImportData";
import ClientExportData from "../interface/ClientExportData";
import * as SocketIO from 'socket.io';

class Client {
    public server: SocketIO.Namespace;
    public socket: SocketIO.Socket;
    public token: string;
    public name: string;
    public character: string;
    public position: { x: number, y: number } = { x: 50, y: 50 };
    public targetPosition: { x: number, y: number } = { x: 0, y: 0 };
    public vector: { x: number, y: number } = { x: 0, y: 0 };
    public score: number = 0;
    public dirty: boolean = false;

    constructor(socket: SocketIO.Socket, client: ClientImportData) {
        this.socket = socket;
        this.socket.on('touch', this.touch.bind(this));
        this.token = client.token;
        this.name = client.name;
        this.character = client.character;
    }

    public update(dt: number): void {
        if (Math.abs(this.targetPosition.x - this.position.x) <= Math.abs(dt * this.vector.x)) {
            this.position.x = this.targetPosition.x;
            this.vector.x = 0;
            this.dirty = true;
        } else {
            this.position.x += dt * this.vector.x;
        }

        if (Math.abs(this.targetPosition.y - this.position.y) <= Math.abs(dt * this.vector.y)) {
            this.position.y = this.targetPosition.y;
            this.vector.y = 0;
            this.dirty = true;
        } else {
            this.position.y += dt * this.vector.y;
        }

        if (this.dirty) {
            this.server.emit('setObjectState', this.export);
            this.dirty = false;
        }
    }

    public touch(position: { x: number, y: number }): void {
        const SPEED: number = 0.3;
        const diffX: number = position.x - this.position.x;
        const diffY: number = position.y - this.position.y;
        this.vector.x = SPEED * Math.cos(Math.atan2(diffY, diffX));
        this.vector.y = SPEED * Math.sin(Math.atan2(diffY, diffX));
        this.targetPosition = position;
        this.dirty = true;
    }

    public reConnect(socket: SocketIO.Socket): void {
        this.socket.removeAllListeners();
        this.socket = socket;
        this.socket.on('touch', this.touch.bind(this));
    }

    public get export(): ClientExportData {
        return {
            token: this.token,
            name: this.name,
            character: this.character,
            position: this.position,
            vector: this.vector,
            score: this.score,
            targetPosition: this.targetPosition
        };
    }
}

export default Client;