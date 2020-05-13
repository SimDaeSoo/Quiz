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
        this.updater.on('update', 12, this.update.bind(this));
    }

    update(dt) {
        if (this.lastUpdated === undefined) {
            this.lastUpdated = Date.now();
            this.updateCount = 0;
        }

        for (let key in this.users) {
            const user = this.users[key];
            user.update(dt);
            this.test += dt;
        }

        if (this.lastUpdated + 1000 <= Date.now()) {
            this.ups = this.updateCount;
            this.updateCount = 0;
            this.lastUpdated = Date.now();
        } else {
            this.updateCount++;
        }
    }

    setState(userData) {
        if (this.users[userData.token]) {
            this.users[userData.token].setState(userData);
        } else {
            console.log(userData);
        }
    }

    createObject(data) {
        if (!this.users[data.token]) {
            this.users[data.token] = new User(data);
        } else {
            this.setState(data);
        }
    }

    destroyObject(data) {
        if (this.users[data.token]) {
            delete this.users[data.token];
        }
    }

    destroy() {
        this.updater.removeAll();
    }
}

export default Logic;