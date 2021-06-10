import { Client, Message } from "discord.js";
import BotState from "../BotState";
import Command from "../command";
class HelpCommand implements Command {
    name = "help";
    description = "Show this Page!";
    aliases = ["h"];
    execute(client: Client, state: BotState, message: Message, args: string[]): void {
        let msg = "Command List: \n"
        for (let rawcmd of state.commands) {
            let cmd = rawcmd[1]
            msg = msg + ("!" + cmd.name + " : " + cmd.description +  " [" + cmd.aliases + "]\n") //TODO import command trigger

            
        }
        message.channel.send(msg.trim());
    }

}
export default (new HelpCommand())