import Updater from "./updater";
import User from './user';

class Logic {
    constructor() {
        this.users = {};
        this.updater = new Updater();
    }

    initialize(room) {
        const users = {};
        for (let key in room.users) {
            const user = room.users[key];
            users[key] = new User(user);
        }
        this.users = users;
        console.log(room);
    }

    start() {
        this.updater.on('update', 16, this.update.bind(this));
    }

    update(dt) {
        for (let key in this.users) {
            const user = this.users[key];
            user.update(dt);
        }
    }
}

export default Logic;