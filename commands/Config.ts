import { Client, Message } from "discord.js";
import BotState from "../BotState";
import Command from "../command";
import { ServerState } from "../util/ServerState";
import { PermissionHelper } from "../util/PermissionHelper";
class HelpCommand implements Command {
    name = "config";
    description = "list and set up configs";
    aliases = [];
    required_permissions = [PermissionHelper.Permission.GUILD_ADMIN];
    configKeys = ['prefix']
    execute(client: Client, state: BotState, serverState: ServerState, message: Message, args: string[]): void {
        if (args.length <= 1) {
            message.channel.send("Usage: config set <param> val\n config list");
        }
        let second_arg = args[1];
        if (second_arg == "set") {
            if (args.length <= 3) {
                message.channel.send("Usage: config set <param> <val>");
                return;
            }
            let key = args[2]
            console.log(key)
            if (!(this.configKeys.includes(key))) {
                message.channel.send("Unknown config Key!");
                return;
            }
            let valtoset = args[3];
            serverState[key] = valtoset;
            state.db.push('/guild/' + message.guild.id, serverState)
            message.channel.send("Value set!");


        } else if (second_arg == "list") {
            let outString = '```Current Config: \n'
            for (let key of this.configKeys) {
                outString += key + " = '" + serverState[key] + "'\n";
            }
            outString += '```'
            message.channel.send(outString);
        }
    }

}
export default (new HelpCommand())