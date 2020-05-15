import Dictionary from '../interface/Dictionary';
import ClientImportData from '../interface/ClientImportData';
import ClientExportData from "../interface/ClientExportData";
import Client from './Client';
import * as SocketIO from 'socket.io';
import GameLogic from './GameLogic';
import axios, { AxiosResponse } from 'axios';
import Quiz from '../interface/Quiz';
import Command from '../interface/Command';
import ROOM_STATE from '../interface/RoomState';

class GameRoom {
    public title: string;
    public server: SocketIO.Server;
    public quizID: string;
    public id: number;
    public owner: string;
    public ownerSocket: SocketIO.Socket;
    public state: ROOM_STATE = ROOM_STATE.READY;
    public map: { sx: number, sy: number, ex: number, ey: number } = { sx: 0, sy: 0, ex: 1700, ey: 850 };
    public userDictionary: Dictionary<Client> = {};
    public logic: GameLogic = new GameLogic();
    private authToken: string = '';
    private quiz: Quiz;
    private currentQuizIndex: number = 0;

    constructor(quizID: string, title: string, id: number) {
        this.quizID = quizID;
        this.id = id;
        this.title = title;
        this.logic.setUsers(this.userDictionary);
        this.logic.start();
    }

    public get export(): RoomExportData {
        return {
            id: this.id,
            quizID: this.quizID,
            owner: this.owner,
            users: this.userExportDatas,
            map: this.map,
            state: this.state
        };
    }

    public get simpleExport(): RoomExportData {
        return {
            id: this.id,
            quizID: this.quizID,
            owner: this.owner,
            map: this.map,
            state: this.state
        };
    }

    public setServer(server: SocketIO.Server): void {
        this.server = server;
    }

    public reConnect(socket: SocketIO.Socket, token: string): void {
        socket.join(`room${this.id}`);
        if (token === this.owner) {
            this.ownerSocket = socket;
            socket.on('ownerCommand', this.ownerCommand.bind(this));
        } else {
            this.userDictionary[token].reConnect(socket);
        }
        socket.emit('setRoomState', this.simpleExport);
    }

    public join(socket: SocketIO.Socket, client: ClientImportData): void {
        if (this.state !== ROOM_STATE.READY) return;
        socket.join(`room${this.id}`);
        if (client.token !== this.owner) {
            this.userDictionary[client.token] = new Client(socket, client, this.id);
            this.userDictionary[client.token].server = this.server;
            this.server.to(`room${this.id}`).emit('createObject', this.userDictionary[client.token].export);
        } else {
            this.ownerSocket = socket;
            socket.on('ownerCommand', this.ownerCommand.bind(this));
        }
        socket.emit('setRoomState', this.simpleExport);
    }

    public leave(socket: SocketIO.Socket): void {
        if (this.state !== ROOM_STATE.READY) return;
        for (let token in this.userDictionary) {
            const user: Client = this.userDictionary[token];

            if (user.socket.id === socket.id) {
                socket.emit('ban');
                socket.removeAllListeners();
                if (this.userDictionary[token]) {
                    this.server.to(`room${this.id}`).emit('destroyObject', this.userDictionary[token].export);
                    delete this.userDictionary[token];
                }
            }
        }

        if (this.ownerSocket && socket.id === this.ownerSocket.id) {
            socket.emit('ban');
            socket.removeAllListeners();
            this.ownerSocket = undefined;
        }

        const length = Object.keys(this.userDictionary).length;
        if (!length && !this.ownerSocket) {
            this.logic.destroy();
            this.destroy(this);
        }
    }

    public destroy: (room: GameRoom) => void;
    public setDestroy(callback: (room: GameRoom) => void): void {
        this.destroy = callback;
    }

    public setOwner(client: ClientImportData): void {
        this.owner = client.token;
    }

    public setToken(token: string): void {
        this.authToken = token;
    }

    public async fetchQuiz(quizID: string): Promise<void> {
        const response: AxiosResponse<Quiz> = await axios.get(`${process.env.SERVER_ADDRESS}/api/quizzes/${quizID}`, { headers: { Authorization: `Bearer ${this.authToken}` } });
        const quiz: Quiz = response.data;
        this.quiz = quiz;
    }

    public get userExportDatas(): Dictionary<ClientExportData> {
        const result: Dictionary<ClientExportData> = {};

        for (let token in this.userDictionary) {
            const user: Client = this.userDictionary[token];
            result[token] = user.export;
        }

        return result;
    }

    private nextQuestion(): void {
        this.logic.enablePosition();
        setTimeout(() => {
            const question: any = this.quiz.questions[this.currentQuizIndex];
            const number: string = this.quiz.questions[this.currentQuizIndex + 1] ? `${this.currentQuizIndex + 1}번` : '마지막';
            const parsedQuestion: any = {
                content: `[${number} 문제] ${question.content}`,
                score: question.score
            };
            this.server.to(`room${this.id}`).emit('showQuestion', parsedQuestion);
            this.timer();
        }, 500);
    }

    private timer(): void {
        let time: number = 10;
        this.server.to(`room${this.id}`).emit('countDown', 10);
        const timer: any = () => {
            setTimeout(() => {
                if (time > 0) {
                    time--;
                    this.server.to(`room${this.id}`).emit('countDown', time);
                    timer();
                } else {
                    this.logic.disablePosition();
                    this.scoringUser(this.quiz.questions[this.currentQuizIndex].score, this.quiz.questions[this.currentQuizIndex].Answer, this.quiz.questions[this.currentQuizIndex].explain);
                    if (this.quiz.questions[this.currentQuizIndex + 1]) {
                        this.currentQuizIndex++;
                        this.state = ROOM_STATE.READY_NEXT_QUESTION;
                        this.server.to(`room${this.id}`).emit('setRoomState', this.simpleExport);
                    } else {
                        this.state = ROOM_STATE.END_OF_QUESTION;
                        this.server.to(`room${this.id}`).emit('setRoomState', this.simpleExport);
                    }
                }
            }, 1000);
        }
        timer();
    }

    private scoringUser(score: number, answer: boolean, explain: string): void {
        const changedUser: Dictionary<ClientExportData> = {};
        for (let token in this.logic.users) {
            const user: Client = this.logic.users[token];
            if (user.position.x <= 850 && answer) {
                user.score += score;
                changedUser[user.token] = user.export;
            } else if (user.position.x >= 851 && !answer) {
                user.score += score;
                changedUser[user.token] = user.export;
            }
        }

        this.server.to(`room${this.id}`).emit('scoringUser', changedUser, answer, explain);
    }

    private ownerCommand(command: Command): void {
        switch (command.type) {
            case 'start':
                this.state = ROOM_STATE.STARTED;
                this.server.to(`room${this.id}`).emit('setRoomState', this.simpleExport);
                this.nextQuestion();
                break;
            case 'next':
                if (this.state === ROOM_STATE.READY_NEXT_QUESTION) {
                    this.state = ROOM_STATE.STARTED;
                    this.server.to(`room${this.id}`).emit('setRoomState', this.simpleExport);
                    this.nextQuestion();
                }
                break;
            case 'quit':
                this.state = ROOM_STATE.READY;
                for (let token in this.userDictionary) {
                    this.leave(this.userDictionary[token].socket);
                }
                this.leave(this.ownerSocket);
                break;
        }
    }
}

interface RoomExportData {
    id: number;
    quizID: string;
    owner: string;
    users?: Dictionary<ClientExportData>;
    map: { sx: number, sy: number, ex: number, ey: number };
    state: ROOM_STATE;
}

export default GameRoom;