import SocketIO from 'socket.io-client';

export default class GameClient {
    connect(url) {
        this.socket = SocketIO(url);
        this.socket.on('connect', this.connected.bind(this));
        this.socket.on('disconnect', this.disconnected.bind(this));
        return this.socket;
    }

    disconnect() {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket.close();
    }

    connected() {
        console.log('connected');
    }

    disconnected() {
        console.log('disconneted');
    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    destroy() {
        this.socket.disconnect();
        this.socket = undefined;
    }
}