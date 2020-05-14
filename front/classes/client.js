import SocketIO from 'socket.io-client';
import GameRenderer from './renderer';
import fetch from 'isomorphic-unfetch';
import {
    message
} from 'antd';
import Logic from './logic';
import {
    ROOM_STATE
} from '../utils';

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
        this.socket.on('setObjectState', this.setObjectState.bind(this));
        this.socket.on('createObject', this.createObject.bind(this));
        this.socket.on('destroyObject', this.destroyObject.bind(this));
        this.socket.on('setRoomState', this.setRoomState.bind(this));
        this.socket.on('showQuestion', this.showQuestion.bind(this));
        this.socket.on('countDown', this.countDown.bind(this));
        this.socket.on('scoringUser', this.setUserData.bind(this));
        this.socket.emit('_ping', Date.now());
        return this.socket;
    }

    async cetrification() {
        if (localStorage.IDENTIFY_TOKEN) {
            const verifying = await fetch(`/api/tokens/${localStorage.IDENTIFY_TOKEN}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const verifiedToken = await verifying.json();
            if (verifiedToken.error) {
                localStorage.removeItem('IDENTIFY_TOKEN');
            }
        }

        if (!localStorage.IDENTIFY_TOKEN) {
            const response = await fetch(`/api/tokens`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const token = await response.json();
            if (token.id) {
                localStorage.IDENTIFY_TOKEN = token.id;
            }
        }
        this.token = localStorage.IDENTIFY_TOKEN;
        this.setState({
            token: this.token
        });
    }

    pong(dt) {
        const ping = Date.now() - dt;
        let fps = 0;
        let ups = 0;
        if (this.renderer && this.renderer.fps) {
            fps = this.renderer.fps
        }
        if (this.logic && this.logic.ups) {
            ups = this.logic.ups
        }
        setTimeout(() => {
            this.socket.emit('_ping', Date.now());
        }, 2000);
        this.setState({
            ping,
            fps,
            ups
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
        this.rendering = false;
        if (this.renderer) {
            this.renderer.fps = 0;
            this.renderer.destroy();
        }
        if (this.logic) {
            this.logic.ups = 0;
            this.logic.destroy();
        }
        const mainState = STATE.LOGIN;
        const isOwner = false;
        this.setState({
            connected: false,
            ups: 0,
            fps: 0,
            userCount: 0,
            mainState,
            isOwner
        });
        message.error('Server disconnected');
    }

    destroy() {
        this.socket.disconnect();
        this.socket = undefined;
        this.setState = undefined;
        this.renderer = undefined;
    }

    applyCreateRoom(quizID, title) {
        this.socket.emit('applyCreateRoom', quizID, title, {
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
        if (room.owner === this.token) {
            this.setState({
                mainState,
                isOwner: true,
                ownerCommand: this.ownerCommand
            });
        } else {
            this.setState({
                mainState
            });
        }
        this.renderer = new GameRenderer();
        this.renderer.setLogic(this.logic);
        this.renderer.initialize({
            el: this.renderElements
        });
        this.renderer.setTarget(this.token);

        this.rendering = true;
        const render = () => {
            if (this.rendering) {
                this.renderer.render();
                requestAnimationFrame(render);
            }
        }
        render();
    }

    ownerCommand = (data) => {
        this.socket.emit('ownerCommand', data);
    }

    intialize(room) {
        message.success('OX 퀴즈에 오신것을 환영합니다!.');
        this.room = room;
        this.logic = new Logic();
        this.logic.setClientState = this.setState;
        this.logic.token = this.token;
        this.logic.initialize(this.socket, room);
        this.logic.start();
        this.setState({
            userCount: Object.keys(this.logic.users).length
        });
    }

    joinRoom(roomID) {
        this.socket.emit('applyJoinRoom', {
            token: this.token,
            name: this.name,
            character: this.character
        }, roomID);
    }

    setObjectState(data) {
        if (this.logic) {
            this.logic.setState(data);
        }
    }

    createObject(data) {
        if (this.logic) {
            this.logic.createObject(data);
            this.setState({
                userCount: Object.keys(this.logic.users).length
            });
        }
    }

    destroyObject(data) {
        if (this.logic) {
            this.logic.destroyObject(data);
            this.setState({
                userCount: Object.keys(this.logic.users).length
            });
        }
    }

    setRoomState(room) {
        if (this.room && this.room.state !== room.state && room.state === ROOM_STATE.END_OF_QUESTION) {
            setTimeout(() => {
                message.info('모든 퀴즈가 끝났습니다!. 고생하셨습니다!!.');
            }, 1000);
        }
        this.room = room;
        this.setState({
            room
        });
    }

    showQuestion(question) {
        message.info({
            content: `${question.content} (${question.score} 점)`,
            duration: 8
        });
    }

    setUserData(users, answer, explain) {
        message.info(`정답은 ${answer?'O':'X'} 입니다!. ${explain}`);
        for (let token in users) {
            if (this.logic.users[token]) {
                this.logic.users[token].setState(users[token]);
            }
        }
    }

    countDown(time) {
        this.setState({
            time: time
        });
    }

    zoomUp() {
        if (this.renderer.camera.targetZoom <= 1.9) {
            this.renderer.camera.setZoom(this.renderer.camera.targetZoom + 0.1)
        } else {
            this.renderer.camera.setZoom(2);
        }
    }

    zoomDown() {
        if (this.renderer.camera.targetZoom >= 0.5) {
            this.renderer.camera.setZoom(this.renderer.camera.targetZoom - 0.1)
        } else {
            this.renderer.camera.setZoom(0.4);
        }
    }
}