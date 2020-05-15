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
        this.room = room;
        this.users = users;
        this.map = room.map;
        this.socket = socket;
    }

    start() {
        this.updater.on('update', 16, this.update.bind(this));
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
            this.setClientState({
                users: this.getUsers(),
                my: this.users[this.token]
            });
        } else {
            this.updateCount++;
        }
    }

    getUsers() {
        const users = [];
        for (let token in this.users) {
            const user = this.users[token];
            users.push(user);
        }

        return users.sort((userA, userB) => {
            if (userA.score > userB.score) {
                return -1;
            } else if (userA.score < userB.score) {
                return 1;
            } else if (userA.score === userB.score) {
                return 0;
            }
        });
    }

    setAllState(users) {
        for (let token in users) {
            if (this.users[token]) {
                this.users[token].setState(users[token]);
            }
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