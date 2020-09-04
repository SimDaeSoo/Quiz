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
        const response: AxiosResponse = await axios.post(`http://218.144.17.243/api/tokens`);
        if (response && response.data && response.data.id) {
            this.token = response.data.id;
        }
    }

    private async connection(): Promise<void> {
        return new Promise((resolve): void => {
            this.socket = SocketIO('http://218.144.17.243:3333/');
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
            }, 500);
        }
        touch();
    }

    private async join(): Promise<void> {
        const tryJoin: any = () => {
            setTimeout(async () => {
                const response: AxiosResponse = await axios.get(`http://218.144.17.243:3333/rooms`);
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