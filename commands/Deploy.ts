import { Client, Message } from "discord.js";
import BotState from "../BotState";
import Command from "../command";
import { LocalMemberData } from "../util/LocalClanState";
import { PermissionHelper } from "../util/PermissionHelper";
import { ServerState } from "../util/ServerState";

class DeployCommand implements Command {
  name = "deploy";
  description = "deploy yourself";
  aliases = ["d"];
  required_permissions = [];
  constructor() {
  }
  async execute(client: Client, state: BotState,serverState: ServerState, message: Message, args: string[]): Promise<void> {

    // if (args.length <= 1) {
    //   message.channel.send("Invalid Format use .d <playername>")
    //   return;
    // }
    // let targetUser = message.content.substr(message.content.indexOf(' ') + 1);

    // let clandata = await state.clanClient.getClanData('2');
    // state.clanState.update(clandata);

    // let targetMember = state.clanState.clanData.members.find((elem) => { return elem.name.toLocaleLowerCase() == targetUser.toLocaleLowerCase() });
    // if (!targetMember) {
    //   message.channel.send("Unable to find Member: " + targetUser);
    //   return;
    // }
    // if (targetMember.deployed) {
    //   message.channel.send(targetUser + " is already Deployed. Refreshing Deployment Status");
    //   targetMember.lastDeployed = Date.now();
    //   state.clanState.save()
    //   return;
    // }


    // let toUndeploy = this.getPlayerToUndeploy(state.clanState.clanData.members)
    // targetMember.deployed = true;
    // targetMember.lastDeployed = Date.now()
    // if (toUndeploy) {
    //   toUndeploy.deployed = false;
    // }
    // state.clanClient.updateClanStatus(state.clanState.generateClanStatus());
    // let msg = "Deployed: " + targetMember.name;
    // if (toUndeploy) {
    //   msg += "\nUndeploying: " + toUndeploy.name;
    // }
    // msg += "\nMake sure to refresh your game to start earning CP. (just waiting untill a new game does not update it)";
    // message.channel.send(msg);
    // state.clanState.save()


  }
  getPlayerToUndeploy(members: LocalMemberData[]): LocalMemberData {

    let deployedList = []
    for (let mem of members) {
      if (mem.deployed) {
        deployedList.push(mem);
      }
    }
    if (deployedList.length < 20) {
      return;
    }
    let longestDeployed = deployedList[0];
    // console.log(deployedList)
    for (let mem of deployedList) {
      if (longestDeployed.lastDeployed > mem.lastDeployed && mem.deployed) { //Bug if 
        longestDeployed = mem;
      }
    }
    return longestDeployed;
  }

}

export default new DeployCommand()