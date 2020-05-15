import Bot from "./classes/bot";

function start(): void {
    for (let i = 0; i < 200; i++) {
        const bot: Bot = new Bot(`봇 ${i}`);
        bot.start();
    }
}

start();