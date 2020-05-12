import Updater from "./updater";
import User from './user';

class Logic {
    constructor() {
        this.users = {};
        this.updater = new Updater();
        this.test = 1;
    }

    initialize(socket, room) {
        const users = {};
        for (let key in room.users) {
            const user = room.users[key];
            users[key] = new User(user);
        }
        this.users = users;
        this.map = room.map;
        this.socket = socket;
    }

    start() {
        this.updater.on('update', 16, this.update.bind(this));
    }

    update(dt) {
        for (let key in this.users) {
            const user = this.users[key];
            user.update(dt);
            this.test += dt;
        }
    }

    setState(userData) {
        this.users[userData.token].setState(userData);
    }

    createObject(data) {
        if (!this.users[data.token]) {
            this.users[data.token] = new User(data);
        } else {
            this.setState(data);
        }
    }

    destroy() {
        this.updater.removeAll();
    }
}

export default Logic;