import SocketIO from 'socket.io-client';
import fetch from 'isomorphic-unfetch';
import {
    message
} from 'antd';

export default class GameClient {
    connect(url) {
        this.socket = SocketIO(url);
        this.socket.on('connect', this.connected.bind(this));
        this.socket.on('disconnect', this.disconnected.bind(this));
        this.socket.on('_pong', this.pong.bind(this));
        this.socket.emit('_ping', Date.now());
        return this.socket;
    }

    async cetrification() {
        if (!localStorage.IDENTIFY_TOKEN) {
            const response = await fetch(`/api/tokens`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const token = await response.json();
            localStorage.IDENTIFY_TOKEN = token.id;
        }
        this.token = localStorage.IDENTIFY_TOKEN;
        this.setState({
            token: this.token
        });
    }

    pong(dt) {
        const ping = Date.now() - dt;
        setTimeout(() => {
            this.socket.emit('_ping', Date.now());
        }, 2000);
        this.setState({
            ping
        });
    }

    disconnect() {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket.close();
    }

    connected() {
        this.setState({
            connected: true
        });
        message.success('Server connected');
    }

    disconnected() {
        this.setState({
            connected: false
        });
        message.error('Server disconnected');
    }

    destroy() {
        this.socket.disconnect();
        this.socket = undefined;
        this.setState = undefined;
        this.renderer = undefined;
    }

    applyCreateRoom() {

    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    setStateCallback(callback) {
        this.setState = callback;
    }
}