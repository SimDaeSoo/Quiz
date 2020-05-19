import Updater from "./Updater";
import Dictionary from "../interface/Dictionary";
import Client from "./Client";
import * as SocketIO from 'socket.io';
import ClientExportData from "../interface/ClientExportData";

class GameLogic {
    public server: SocketIO.Server;
    public ID: number;
    public users: Dictionary<Client>;
    public updater: Updater = new Updater();
    private lastLatency: number = 0;
    private DEFAULT_EMIT_LAYENCY: number = 100;
    private CURRENCT_USER_EMIT_LAYENCY: number = 100;

    public setUsers(users: Dictionary<Client>): void {
        this.users = users;
    }

    public start(): void {
        this.updater.on('update', 16.66, this.update.bind(this));
    }

    public setServer(server: SocketIO.Server, ID: number): void {
        this.server = server;
        this.ID = ID;
    }

    public destroy(): void {
        this.updater.removeAll();
    }

    public emitAllUser(): void {
        const users: Dictionary<ClientExportData> = {};
        for (let token in this.users) {
            if (this.users[token].dirty) {
                const user: ClientExportData = this.users[token].export;
                users[token] = user;
                this.users[token].dirty = false;
            }
        }
        this.server.to(`room${this.ID}`).emit('setAllState', users);
    }

    public update(dt: number): void {
        for (let key in this.users) {
            const user: Client = this.users[key];
            user.update(dt);
        }

        this.lastLatency += dt;
        this.CURRENCT_USER_EMIT_LAYENCY = Object.keys(this.users).length;
        if (this.lastLatency >= this.DEFAULT_EMIT_LAYENCY && this.lastLatency >= this.CURRENCT_USER_EMIT_LAYENCY + 50) {
            this.lastLatency = 0;
            this.emitAllUser();
        }
    }

    public disablePosition(): void {
        for (let key in this.users) {
            const user: Client = this.users[key];
            user.disablePosition();
        }
    }

    public enablePosition(): void {
        for (let key in this.users) {
            const user: Client = this.users[key];
            user.enablePosition();
        }
    }
}

export default GameLogic;