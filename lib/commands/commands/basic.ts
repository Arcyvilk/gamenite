import Discord from 'discord.js';
import axios from 'axios';
import { cache } from '../../storage/cache';
import { createEmbed, getCommandSymbol, splitArrayByObjectKey, removeKeyword } from '../../helpers';
import { chooseRandom } from '../../rng';
import config from '../../../config.json';

type TField = {
    title: string,
    content: string
}

export const help = (msg:Discord.Message) => {
    let fields = new Array<TField>();
    let commands = cache["commands"]
        .filter(command => command.isModOnly === false && command.description);
    commands = splitArrayByObjectKey(commands, 'category');

    for (let category in commands) {
        const title = `Category ${category.toUpperCase()}`;
        let content = '';
        commands[category].map(command => content += `- **${getCommandSymbol()}${command.keyword}** - ${command.description}\n`);
        fields.push({ title, content })
    }
        
    const embed = createEmbed('📜 List of commands', fields);
    msg.author.send({ embed })
        .then(() => msg.react('📩'))
        .catch(err =>
            msg.channel.send(createEmbed(':warning: I am unable to reply to you', [{ title: '\_\_\_', content: `This command sends the reply to your DM, and it seems you have DMs from members of this server disabled.
            \nTo be able to receive messages from me, go to \`\`User Settings => Privacy & Safety => Allow direct messages from server members\`\` and then resend the command.` }]
            ))
        );
}

export const hmod = (msg:Discord.Message) => {
    let fields = new Array<TField>();
    let commands = cache["commands"]
        .filter(command => command.isModOnly === true && command.description);
    commands = splitArrayByObjectKey(commands, 'category');

    for (let category in commands) {
        const title = `Category ${category.toUpperCase()}`;
        let content = '';
        commands[category].map(command => content += `\`\`-\`\`**${getCommandSymbol()}${command.keyword}** - ${command.description}\n`);
        fields.push({ title, content })
    }
        
    const embed = createEmbed('📜 List of moderator commands', fields);
    msg.author.send({ embed })
        .then(() => msg.react('📩'))
        .catch(err =>
            msg.channel.send(createEmbed(':warning: I am unable to reply to you', [{ title: '\_\_\_', content: `This command sends the reply to your DM, and it seems you have DMs from members of this server disabled.
            \nTo be able to receive messages from me, go to \`\`User Settings => Privacy & Safety => Allow direct messages from server members\`\` and then resend the command.` }]
            ))
        );
}

export const meow = async (msg:Discord.Message) => {
    msg.channel.startTyping();
    const cat:any = await axios(`https://api.thecatapi.com/v1/images/search?api_key=${config.CAT_API_TOKEN}`)
        .catch(() => {
            msg.channel.send('Unable to get a cat.');
            msg.channel.stopTyping();
            return;
        });
    const embed = new Discord.MessageEmbed()
        .setTitle('😺 Cat!')
        .setTimestamp(new Date())
        .setFooter(msg.author.username)
        .setColor('0xFDC000')
        .setImage(cat.data[0].url);
    msg.channel.stopTyping();
    msg.channel.send(embed);
}

export const woof = async (msg:Discord.Message) => {
    msg.channel.startTyping();
    const dog:any = await axios('http://random.dog/woof')
        .catch(() => {
            msg.channel.send('Unable to get a dog.');
            msg.channel.stopTyping();
            return;
        });
    const embed = new Discord.MessageEmbed()
        .setTitle('🐶 Dog!')
        .setTimestamp(new Date())
        .setFooter(msg.author.username)
        .setColor('0xFDC000')
        .setImage(`http://random.dog/${dog.data}`);
    msg.channel.stopTyping();
    msg.channel.send(embed);
}

export const choose = (msg:Discord.Message) => {
    const args = removeKeyword(msg);
    const argsArray = args.split('|');
    const randomThing = chooseRandom(argsArray).trim();

    return argsArray.length === 1
        ? msg.channel.send('...is that supposed to be a choice?')
        : msg.channel.send(`You should ${ randomThing }.`)
}