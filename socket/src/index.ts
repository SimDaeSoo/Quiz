import GameServer from './class/GameServer';

async function start(): Promise<void> {
    const server: GameServer = new GameServer();
    await server.certification(process.env.AUTH_IDENTIFIER, process.env.AUTH_PASSWORD);
    await server.initialize();
    server.open(3333);
}

start();