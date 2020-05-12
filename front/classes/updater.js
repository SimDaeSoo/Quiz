export default class Updater {
    constructor() {
        this.updateCallback = {};
    }

    on(name, duration, callback) {
        let lastTime = Date.now();
        this.updateCallback[name] = setInterval(() => {
            const dt = Date.now() - lastTime;
            callback(dt);
            lastTime += dt;
        }, duration);
    }

    remove(name) {
        clearInterval(this.updateCallback[name]);
        delete this.updateCallback[name];
    }

    removeAll() {
        for (let name in this.updateCallback) {
            clearInterval(this.updateCallback[name]);
            delete this.updateCallback[name];
        }
    }
}