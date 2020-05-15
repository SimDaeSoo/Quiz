import Updater from "./Updater";
import Dictionary from "../interface/Dictionary";
import Client from "./Client";

class GameLogic {
    public users: Dictionary<Client>;
    public updater: Updater = new Updater();

    public setUsers(users: Dictionary<Client>): void {
        this.users = users;
    }

    public start(): void {
        this.updater.on('update', 16, this.update.bind(this));
    }

    public destroy(): void {
        this.updater.removeAll();
    }

    public update(dt: number): void {
        for (let key in this.users) {
            const user: Client = this.users[key];
            user.update(dt);
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