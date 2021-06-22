import { Client, Message } from "discord.js";
import BotState from "../BotState";
import Command from "../command";
import { ServerState } from "../util/ServerState";
class ListDeployed implements Command {
    name = "listDeployed";
    description = "Lists all deployed users (WIP)";
    aliases = ["ld"];
    required_permissions = [];
    async execute(client: Client, state: BotState,serverState: ServerState, message: Message, args: string[]): Promise<void> {
        serverState.clanstate.update(await state.clanClient.getClanData(serverState.clanstate.clanData.gid))
        serverState.clanstate.save();
        let deployed = serverState.clanstate.getDeployedMembers();
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
export default (new ListDeployed())