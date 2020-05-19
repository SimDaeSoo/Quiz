import ClientImportData from "../interface/ClientImportData";
import ClientExportData from "../interface/ClientExportData";
import * as SocketIO from 'socket.io';

class Client {
    public socket: SocketIO.Socket;
    public token: string;
    public name: string;
    public character: string;
    public position: { x: number, y: number } = { x: 50, y: 50 };
    public targetPosition: { x: number, y: number } = { x: 0, y: 0 };
    public vector: { x: number, y: number } = { x: 0, y: 0 };
    public score: number = 0;
    public dirty: boolean = false;
    public roomID: number;
    public boundary: { x: { min: number, max: number }, y: { min: number, max: number } } = { x: { min: 0, max: 1700 }, y: { min: 0, max: 850 } };

    constructor(socket: SocketIO.Socket, client: ClientImportData, roomID: number) {
        this.socket = socket;
        this.socket.on('touch', this.touch.bind(this));
        this.token = client.token;
        this.name = client.name;
        this.character = client.character;
        this.roomID = roomID;
    }

    public update(dt: number): void {
        if (Math.abs(this.targetPosition.x - this.position.x) <= Math.abs(dt * this.vector.x) && this.position.x !== this.targetPosition.x) {
            this.position.x = this.targetPosition.x;
            this.vector.x = 0;
            this.dirty = true;
        } else {
            this.position.x += dt * this.vector.x;
        }

        if (Math.abs(this.targetPosition.y - this.position.y) <= Math.abs(dt * this.vector.y) && this.position.y !== this.targetPosition.y) {
            this.position.y = this.targetPosition.y;
            this.vector.y = 0;
            this.dirty = true;
        } else {
            this.position.y += dt * this.vector.y;
        }

        this.interpolation();
    }

    private interpolation(): void {
        if (this.position.x < this.boundary.x.min) {
            this.position.x = this.boundary.x.min;
            this.vector.x = 0;
            this.targetPosition.x = this.position.x;
            this.dirty = true;
        } else if (this.position.x > this.boundary.x.max) {
            this.position.x = this.boundary.x.max;
            this.vector.x = 0;
            this.targetPosition.x = this.position.x;
            this.dirty = true;
        }

        if (this.position.y < this.boundary.y.min) {
            this.position.y = this.boundary.y.min;
            this.vector.y = 0;
            this.targetPosition.y = this.position.y;
            this.dirty = true;
        } else if (this.position.y > this.boundary.y.max) {
            this.position.y = this.boundary.y.max;
            this.vector.y = 0;
            this.targetPosition.y = this.position.y;
            this.dirty = true;
        }
    }

    public disablePosition(): void {
        if (this.position.x > 850) {
            this.boundary.x.min = 851;
            this.boundary.x.max = 1700;
        } else {
            this.boundary.x.min = 0;
            this.boundary.x.max = 850;
        }
    }

    public enablePosition(): void {
        this.boundary.x.min = 0;
        this.boundary.x.max = 1700;
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

    public get compressionExport(): Array<any> {
        return [
            this.name,
            this.character,
            this.score,
            Number(this.position.x.toFixed(2)),
            Number(this.position.y.toFixed(2)),
            Number(this.vector.x.toFixed(2)),
            Number(this.vector.y.toFixed(2)),
            Number(this.targetPosition.x.toFixed(2)),
            Number(this.targetPosition.y.toFixed(2))
        ];
    }
}

export default Client;