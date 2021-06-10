import { Client, Message } from "discord.js";
import BotState from "../BotState";
import Command from "../command";
class HelpCommand implements Command {
    name = "listDeployed";
    description = "Lists all deployed users (WIP)";
    aliases = ["ld"];
    async execute(client: Client, state: BotState, message: Message, args: string[]): Promise<void> {
        state.clanState.update(await state.clanClient.getClanData("2"))
        state.clanState.save();
        let deployed = state.clanState.getDeployedMembers();
        let msg = "Deployed Members:\n";
        for(let m of deployed){
            msg += m.name + "\n";
        }
        message.channel.send(msg.trim());
        // let msg = "Command List: \n"
        // for (let rawcmd of state.commands) {
        //     let cmd = rawcmd[1]
        //     msg = msg + ("!" + cmd.name + " : " + cmd.description +  " [" + cmd.aliases + "]\n") //TODO import command trigger


        // }
        // message.channel.send(msg.trim());
    }

}
export default (new HelpCommand())