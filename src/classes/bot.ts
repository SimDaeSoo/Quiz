import * as SocketIO from 'socket.io-client';
import axios, { AxiosResponse } from 'axios';

class Bot {
    private token: string;
    private name: string;
    private character: number = 1 + Math.round(Math.random() * 6);
    private socket: SocketIOClient.Socket;

    constructor(name: string) {
        this.name = name;
        console.log(`[${new Date()}] create bot ${name}`);
        this.touchLooping();
    }

    public async start(): Promise<void> {
        await this.connection();
        await this.certification();
        await this.join();
    }

    private async certification(): Promise<void> {
        const response: AxiosResponse = await axios.post(`https://quiz.smartstudy.co.kr/api/tokens`);
        if (response && response.data && response.data.id) {
            this.token = response.data.id;
        }
    }

    private async connection(): Promise<void> {
        return new Promise((resolve): void => {
            this.socket = SocketIO('https://quiz.smartstudy.co.kr');
            this.socket.on('connect', (): void => {
                setInterval(() => {
                    this.socket.emit('_ping', Date.now());
                }, 2000);
                return resolve();
            });
            this.socket.on('ban', (): void => {
                this.socket.removeAllListeners();
                this.socket.disconnect();
                this.socket = undefined;
                this.start();
            });
        });
    }

    private touchLooping(): void {
        const touch: any = () => {
            setTimeout(async () => {
                if (this.socket) {
                    this.socket.emit('touch', { x: Math.round(Math.random() * 1700), y: Math.round(Math.random() * 850) })
                }
                touch();
            }, 400);
        }
        touch();

        const chat: any = () => {
            setTimeout(async () => {
                if (this.socket) {
                    this.socket.emit('chat', 'Hello?');
                }
                chat();
            }, 2000);
        }
        chat();
    }

    private async join(): Promise<void> {
        const tryJoin: any = () => {
            setTimeout(async () => {
                const response: AxiosResponse = await axios.get(`https://quiz.smartstudy.co.kr/rooms`);
                const rooms: Array<any> = response.data;
                if (rooms.length >= 1) {
                    const roomIndex: number = Math.round(Math.random() * (rooms.length - 1));
                    const roomID: number = rooms[roomIndex].id;
                    this.socket.emit('applyJoinRoom', {
                        token: this.token,
                        name: this.name,
                        character: this.character
                    }, roomID);
                } else {
                    tryJoin();
                }
            }, 1000 + Math.round(Math.random() * 3000));
        }

        tryJoin();
    }
}

export default Bot;