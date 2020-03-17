import Discord from 'discord.js';
import { log } from '../../log';
import { createEmbed, extractArguments, removeKeyword } from '../../helpers';
import { cache } from '../../storage/cache';

const returnRoleID = (roleName, member) => {
    const role = member.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    if (role && role.id)
        return role.id;
    return undefined;
};
const roleExists = (roleName, member) => {
    const role = member.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
    if (role)
        return true;
    return false;
};
const roleisAssignable = (roleName) => {
    const assignableRoles = cache["options"].find(option => option.option === 'assignableRoles')
        ? cache["options"].find(option => option.option === 'assignableRoles').value
        : null;
    if (!assignableRoles || !assignableRoles.find(role => role.toLowerCase() === roleName.toLowerCase()))
        return false;
    return true;
}
const userHasRole = (roleName, member) => {
    if (member.roles.cache.has(returnRoleID(roleName, member)))
        return true;
    return false;
};
const requestWasSendInApropriateChannel = (msg:Discord.Message) => {
    if (!msg.guild)
        return true;
    const room_roles = cache["options"].find(option => option.option === 'room_roles')
        ? cache["options"].find(option => option.option === 'room_roles').value
            // @ts-ignore:next-line
            ? cache["options"].find(option => option.option === 'room_roles').value.find(server => server.guild === msg.guild.id).id
            : null
        : null
    if (!room_roles || room_roles == msg.channel.id)
        return true;
    return false;
};
export const iam = (msg:Discord.Message) => {
    const roleName = removeKeyword(msg);
    const member = msg.member;

    if (!roleName)
        return msg.channel.send(`Excuse me, you are _what?_`);
    if (!roleExists(roleName, member))
        return msg.channel.send(`Role **[${roleName.toUpperCase()}]** doesn't exist.`);
    if (!roleisAssignable(roleName))
        return msg.channel.send(`Role **[${roleName.toUpperCase()}]** cannot be self-assigned.`);
    if (userHasRole(roleName, member))
        return msg.channel.send(`You already have the **[${roleName.toUpperCase()}]** role.`);
    if (!member)
        return msg.channel.send(`Something went wrong ;-;`);

    member.roles.add(returnRoleID(roleName, member))
        .then(success => msg.channel.send(`Assigned **[${roleName.toUpperCase()}]** to ${member.user.username}!`))
        .catch(error => {
            msg.channel.send(`Failed to assign the **[${roleName.toUpperCase()}]** role.`);
            log.WARN(error);
        });
    return;
}
export const iamnot = (msg:Discord.Message) => {
    const roleName = extractArguments(msg)[0];
    const member = msg.member;
    
    if (!roleName)
        return msg.channel.send(`Excuse me, you aren't _what?_`);
    if (!roleExists(roleName, member))
        return msg.channel.send(`Role **[${roleName.toUpperCase()}]** doesn't exist.`);
    if (!roleisAssignable(roleName))
        return msg.channel.send(`Role **[${roleName.toUpperCase()}]** cannot be self-unassigned.`);
    if (!userHasRole(roleName, member))
        return msg.channel.send(`You don't have the **[${roleName.toUpperCase()}]** role.`);
    if (!requestWasSendInApropriateChannel(msg))
        return msg.channel.send(`I'm not doing that outside the <#${cache["options"].find(option => option.option === 'room_roles').value}> room.`);
    if (!member)
        return msg.channel.send(`Something went wrong ;-;`);
    member.roles.remove(returnRoleID(roleName, member))
        .then(success => msg.channel.send(`Removed **[${roleName.toUpperCase()}]** from ${member.user.username}!`))
        .catch(error => {
            msg.channel.send(`Failed to remove the **[${roleName.toUpperCase()}]** role.`);
            log.WARN(error);
        });
    return;
}
export const roles = (msg:Discord.Message) => {
    msg.channel.startTyping();
    if (!msg.guild)
        return;
    //@ts-ignore:next-line
    const existingRoles = msg.guild.roles.cache.map(role => role.name);
    const assignableRoles = cache["options"].find(option => option.option === 'assignableRoles')
        ? cache["options"].find(option => option.option === 'assignableRoles').value
        : null;
    const availableRoles:string[] = [];
    
    if (!existingRoles || !assignableRoles) {
        msg.channel.stopTyping();
        return;
    }
    assignableRoles.map((assignableRole:string) => {
        existingRoles.find(existingRole => existingRole.toLowerCase() === assignableRole.toLowerCase())
        && availableRoles.push(`- ${assignableRole}`)
    })

    const embed = createEmbed('Self-assignable roles', [{ title: '\_\_\_', content: availableRoles.length === 0
        ? 'There are no self-assignable roles.'
        : availableRoles.join('\n')}])
    msg.channel.stopTyping();
    msg.channel.send(embed);
}