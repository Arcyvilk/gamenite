import Discord from 'discord.js';
import moment from 'moment';
import { IEmbedField } from './types/commands';
import { cache } from './storage/cache';

export const getCommandSymbol = () => cache["options"].find(option => option.option === 'commandSymbol').value;

export const getKeyword = (msg:Discord.Message) => {
    const argumentsPresent = msg.content.includes(' ');
    const keyword = argumentsPresent
        ? msg.content.substring(1, msg.content.indexOf(' '))
        : msg.content.substring(1);
    return keyword.toLowerCase();
};

export const removeKeyword = (msg:Discord.Message) => {
    if (msg.content.indexOf(' ') !== -1)
        return msg.content.substring(msg.content.indexOf(' ')).trim();
    return '';
}

export const hasSeparator = (msg:Discord.Message) => 
    removeKeyword(msg).includes('|');

export const extractArguments = (msg:Discord.Message) => {
    const args = removeKeyword(msg).trim().split(' ');
    if (args.length === 1 && args[0] === '')
        return [];
    return args;
}

export const splitByFirstSymbol = (msg:Discord.Message, symbol:string) => {
    const msgContent = removeKeyword(msg);
    const args = new Array;
    if (msgContent.indexOf(symbol) === -1)
        return [ msgContent ];
    args[0] = msgContent.substring(0, msgContent.indexOf(symbol)).trim();
    args[1] = msgContent.substring(msgContent.indexOf(symbol)).trim();
    return args;
}

export const createEmbed = (title:string, fields:Array<IEmbedField>, color?:string, thumbnail?:string, footer?:string) => {
    const embed = thumbnail
        ? new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color ? `0x${color}` : '0xFDC000')
            .setThumbnail(thumbnail)
            .setFooter(footer ? footer : '')
        : new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color ? `0x${color}` : '0xFDC000')
            .setFooter(footer ? footer : '');
    fields.map(field => embed.addField(field.title, field.content, field.inline ? field.inline : false));
    return embed;
}

export const isLink = (supposedLink:string) => {
    if (supposedLink.startsWith('http'))
        return true;
    return false;
};

export const extractNicknameAndServer = (msg:Discord.Message) => {
    if (!hasSeparator(msg)) {
        msg.channel.send(createEmbed('❌ Incorrect syntax', [{ title: '\_\_\_', content: 'This command requires the symbol **|** to separate nickname from region.' }]));
        return {};
    }
    const nicknameAndServer = removeKeyword(msg).split('|');
    let nickname:string|undefined = encodeURIComponent(nicknameAndServer[0].trim());
    let server:string|undefined = nicknameAndServer[1].trim();
    if (server.toLowerCase() === 'server') {
        msg.channel.send(createEmbed('❌ Incorrect syntax', [{ title: '\_\_\_', content: '\`\`server\`\` means server like EUW or NA or TR, not _literally_ the word "server". <:vikfacepalm:355727809236434945>.' }]));
        server = undefined;
    }
    if (nickname.toLowerCase() === 'ign') {
        msg.channel.send(createEmbed('❌ Incorrect syntax', [{ title: '\_\_\_', content: '\`\`IGN\`\` means **I**n **G**ame **N**ame. Not _literally_ the word "IGN". <:vikfacepalm:355727809236434945>.' }]));
        nickname = undefined;
    }
    return {
        nickname,
        server
    }
}

export const splitArrayByObjectKey = (array:Array<Object>, sortBy:string) =>
    array.reduce((reducer, obj) => {
        let key = obj[sortBy]; 
        if (reducer[key] || (reducer[key]=[])) 
            reducer[key].push(obj);
        return reducer;
    }, {});

export const toDDHHMMSS = (joinedAt:Date) => {
    const start = moment(joinedAt);
    const end = moment();
    const diff = moment.duration(end.diff(start));

    return `${
        moment.duration(diff).years() ? moment.duration(diff).years() + 'y ' : ''
    }${
        moment.duration(diff).months() ? moment.duration(diff).months() + 'm ' : ''
    }${
        moment.duration(diff).days() ? moment.duration(diff).days() + 'd ' : ''
    }${
        moment.duration(diff).hours() ? moment.duration(diff).hours() + 'h ' : ''
    }${
        moment.duration(diff).minutes() ? moment.duration(diff).minutes() + 'm ' : ''
    }${
        moment.duration(diff).seconds() ? moment.duration(diff).seconds() + 's ' : ''
    }`
} 

export const toMMSS = (miliseconds:number) => {
    const duration = miliseconds / 1000;
    const minutes = (duration / 60).toFixed(0);
    const seconds = (duration % 60).toFixed(0);
    return `${minutes} minutes ${seconds} seconds`
} 

export const justifyToRight = (input:string, desiredLength:number) => {
    let output = input; 
    while (output.length < desiredLength)
        output = ` ${output}`;
    return output;
};

export const justifyToLeft = (input:string, desiredLength:number) => {
    let output = input; 
    while (output.length < desiredLength)
        output += ` `;
    return output;
};

export const replaceAll = (stringToReplace:string) => new RegExp(stringToReplace, "gi");

export const modifyInput = (input:string) =>  encodeURIComponent(input.replace(replaceAll(' '), ''))