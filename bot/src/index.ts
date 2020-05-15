import Bot from "./classes/bot";

async function start(): Promise<void> {
    for (let i = 0; i < 250; i++) {
        const bot: Bot = new Bot(`봇 ${i}`);
        bot.start();
        await new Promise((resolve) => { setTimeout(() => resolve(), 500) });
    }
}

start();