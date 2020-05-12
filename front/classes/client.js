import SocketIO from 'socket.io-client';
import GameRenderer from './renderer';
import fetch from 'isomorphic-unfetch';
import {
    message
} from 'antd';
import Logic from './logic';

const STATE = {
    LOGIN: 1,
    CREATE_ROOM: 2,
    SELECT_ROOM: 3,
    JOIN_ROOM: 4
};
export default class GameClient {
    connect(url) {
        this.socket = SocketIO(url);
        this.socket.on('connect', this.connected.bind(this));
        this.socket.on('disconnect', this.disconnected.bind(this));
        this.socket.on('_pong', this.pong.bind(this));
        this.socket.on('joinedRoom', this.joinedRoom.bind(this));
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
        this.socket.emit('cetrification', this.token);
        const mainState = STATE.LOGIN;
        this.setState({
            connected: true,
            mainState
        });
        message.success('Server connected');
    }

    disconnected() {
        this.renderer.destroy();
        const mainState = STATE.LOGIN;
        this.setState({
            connected: false,
            mainState
        });
        message.error('Server disconnected');
    }

    destroy() {
        this.socket.disconnect();
        this.socket = undefined;
        this.setState = undefined;
        this.renderer = undefined;
    }

    applyCreateRoom(quizID) {
        this.socket.emit('applyCreateRoom', quizID, {
            token: this.token,
            name: this.name,
            character: this.character
        });
    }

    setMainElements(elements) {
        this.renderElements = elements;
    }

    setStateCallback(callback) {
        this.setState = callback;
    }

    setPlayer(name, character) {
        this.name = name;
        this.character = character;
    }

    joinedRoom(room) {
        this.intialize(room);
        const mainState = STATE.JOIN_ROOM;
        this.setState({
            mainState
        });
        this.renderer = new GameRenderer();
        this.renderer.initialize({
            el: this.renderElements
        });
        this.renderer.setLogic(this.logic);
        requestAnimationFrame(() => {
            this.renderer.render();
        });
    }

    intialize(room) {
        this.logic = new Logic();
        this.logic.initialize(room);
        this.logic.start();
    }

    joinRoom() {
        this.socket.emit('applyJoinRoom', {
            token: this.token,
            name: this.name,
            character: this.character
        });
    }
}