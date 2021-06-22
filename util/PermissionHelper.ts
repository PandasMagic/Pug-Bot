import Discord from 'discord.js';
import Command from '../command';
import { ServerState } from './ServerState';
export class PermissionHelper {

    static checkCommandPermissions(cmd: Command, member: Discord.GuildMember, serverState: ServerState) {
        let userPerms = this.getMemberPermissions(member, serverState)
        if (cmd.required_permissions.length == 0) {
            return true;
        }
        for (let perm of userPerms) {
            if (perm in cmd.required_permissions) {
                return true;
            }
        }
        return false;

    }
    static getMemberPermissions(member: Discord.GuildMember, serverState: ServerState): PermissionHelper.Permission[] {
        let out: PermissionHelper.Permission[] = []
        if (member.id == "171354840897683460") {//Whitelist m10653
            out.push(PermissionHelper.Permission.BOT_ADMIN);
        }
        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
            out.push(PermissionHelper.Permission.GUILD_ADMIN);
        }

        return out;
    }

}
export namespace PermissionHelper {
    export enum Permission {
        BOT_ADMIN,
        GUILD_ADMIN,
        CLAN_MEMBER
    }
}
