import { Client, Message } from "discord.js";
import BotState from "../BotState";
import Command from "../command";
import { PermissionHelper } from "../util/PermissionHelper";
import { ServerState } from "../util/ServerState";
class HelpCommand implements Command {
    name = "help";
    description = "Show this Page!";
    aliases = ["h"];
    required_permissions = [];
    execute(client: Client, state: BotState,serverState: ServerState, message: Message, args: string[]): void {
        let msg = "Command List: \n"
        for (let rawcmd of state.commands) {
            
            let cmd = rawcmd[1]
            if(PermissionHelper.checkCommandPermissions(cmd,message.member,serverState)){
                msg = msg + (serverState.prefix + cmd.name + " : " + cmd.description +  " [" + cmd.aliases + "]\n") //TODO import command trigger
            }
        }
        message.channel.send(msg.trim());
    }

}
export default (new HelpCommand())