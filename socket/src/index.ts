import GameServer from './class/GameServer';

async function start(): Promise<void> {
    const server: GameServer = new GameServer();
    await server.initialize();
    server.open(3030);
}

start();