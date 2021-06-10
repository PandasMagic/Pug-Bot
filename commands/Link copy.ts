import { Client, Message } from "discord.js";
import BotState from "../BotState";
import Command from "../command";
import ClanApiClient from "../util/ClanApiClient";
import LocalClanState from "../util/LocalClanState";

class testCommand implements Command {
  name = "test";
  description = "Link your Ev account to discord";
  aliases = ["t"];
  execute(client: Client, state: BotState, message: Message, args: string[]): void {
    message.channel.send("Link request detected. Check your Dm's");
    // let t = new PartyConnection("428ba269-dfd1-4ea6-8b7d-351ac2aa02ac","Li<img src=\"image.gif\" onclick=''>")
  }

}
async function tmp(){
  let localState = new LocalClanState("clanstate.json")
  
  let jank = new ClanApiClient();
  await jank.login('PandaMoment', '&FcAhq255$YBXGp6z5g6');

  let data = await jank.getClanData("2");
  localState.update(data);
  localState.save()
  // data.members[0].deployed = false;
  // await jank.updateClanStatus(data)
}
tmp()

export default new testCommand();
