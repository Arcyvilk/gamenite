import Discord from 'discord.js';

import { ICommand } from '../types/commands';
import { 
    TextCommand,
    EmbedCommand,
    CustomCommand,
} from './logic';

import { help, hmod, meow, woof, choose } from './commands/basic';
import { iam, iamnot, roles } from './commands/roles';
import { status } from './commands/mod';

export const Command: { [key:string]: (command:ICommand, msg:Discord.Message) => string | void} = {
    help: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(help, msg),
    hmod: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(hmod, msg),
    
    status: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(status, msg),

    iam: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(iam, msg),
    iamnot: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(iamnot, msg),
    roles: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(roles, msg),

    meow: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(meow, msg),
    woof: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(woof, msg),
    choose: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(choose, msg),
};