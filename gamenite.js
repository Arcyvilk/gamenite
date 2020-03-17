import '@babel/polyfill';
import Discord from 'discord.js';
import { log } from './lib/log';
import { classifyMessage } from './lib/message';
import { mongo } from './lib/storage/mongo';
import { cache } from './lib/storage/cache';
import config from './config.json';

let isReady = false;

const bot = new Discord.Client();
const ready = async () => {
    log.INFO('Awaiting the start of the bot...');
    await mongo.init();
    start();
}
const start = async () => {
    cache["bot"] = bot;
    cache["options"] = await mongo.getCollection('gamenite', 'options');
    cache["commands"] = await mongo.getCollection('gamenite', 'commands');
    cache["reactions"] = await mongo.getCollection('gamenite', 'reactions');
    isReady = true;
    bot.user.setPresence({ activity: { name: "$help for help" }});
    log.INFO(`${new Date().toLocaleString()} - Gamenite starts working!`);
}
bot.on('ready', ready);
bot.on('message', msg => classifyMessage(msg, isReady));
bot.login(config.DISCORD_TOKEN);
