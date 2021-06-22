import { Client, Message } from "discord.js";
import BotState from "../BotState";
import Command from "../command";
import { PermissionHelper } from "../util/PermissionHelper";
import { ServerState } from "../util/ServerState";
class PermsCommand implements Command {
    name = "perms";
    description = "List your Perms";
    aliases = [];
    required_permissions = [];
    execute(client: Client, state: BotState,serverState: ServerState, message: Message, args: string[]): void {
        // let msg = "Command List: \n"
        // for (let rawcmd of state.commands) {
            
        //     let cmd = rawcmd[1]
        //     if(PermissionHelper.checkCommandPermissions(cmd,message.member,serverState)){
        //         msg = msg + (serverState.prefix + cmd.name + " : " + cmd.description +  " [" + cmd.aliases + "]\n") //TODO import command trigger
        //     }
        // }
        let perms = []
        for(let p of PermissionHelper.getMemberPermissions(message.member,serverState) ){
            perms.push(PermissionHelper.Permission[p])
        }
        message.channel.send(perms.toString());
    }

}
export default (new PermsCommand())