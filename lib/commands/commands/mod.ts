import Discord from 'discord.js';
import { cache } from '../../storage/cache';
import { removeKeyword } from '../../helpers';

export const status = (msg:Discord.Message) => cache["bot"].user.setPresence({ activity: { name: removeKeyword(msg) }})
