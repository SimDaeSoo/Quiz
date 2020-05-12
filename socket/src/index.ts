import GameServer from './class/GameServer';

async function start(): Promise<void> {
    const server: GameServer = new GameServer();
    await server.certification('daesoo94', 'vndtkstla2');
    await server.initialize();
    server.open(3333);
}

start();