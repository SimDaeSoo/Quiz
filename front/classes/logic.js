import Updater from "./updater";
import User from './user';

class Logic {
    constructor() {
        this.users = {};
        this.updater = new Updater();
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

    update(dt) {
        if (this.lastUpdated === undefined) {
            this.lastUpdated = Date.now();
            this.updateCount = 0;
        }

        for (let key in this.users) {
            const user = this.users[key];
            user.update(dt);
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
        const userDict = JSON.parse(users);
        for (let token in userDict) {
            if (this.users[token]) {
                this.users[token].setState({
                    token: token,
                    name: userDict[token][0],
                    character: userDict[token][1],
                    score: userDict[token][2],
                    position: {
                        x: userDict[token][3],
                        y: userDict[token][4]
                    },
                    vector: {
                        x: userDict[token][5],
                        y: userDict[token][6]
                    },
                    targetPosition: {
                        x: userDict[token][7],
                        y: userDict[token][8]
                    }
                });
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