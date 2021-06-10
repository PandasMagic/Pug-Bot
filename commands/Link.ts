import { Client, Message } from "discord.js";
import BotState from "../BotState";
import Command from "../command";
import WebSocket from 'ws';
import ClanApiClient from "../util/ClanApiClient";
import LocalClanState from "../util/LocalClanState";

class LinkCommand implements Command {
  name = "link";
  description = "Link your Ev account to discord (WIP)";
  aliases = ["verify"];
  execute(client: Client, state: BotState, message: Message, args: string[]): void {
    message.channel.send("Link request detected. Check your Dm's");
    // let t = new PartyConnection("428ba269-dfd1-4ea6-8b7d-351ac2aa02ac","Li<img src=\"image.gif\" onclick=''>")
  }

}
class PartyConnection {
  pcon: WebSocket;
  state: string;
  partyd: string;
  constructor(lobbyid, alias) {
    let t = {
      "namespace": "prod",
      "clientMetadata": "",
      "joinKind": {
        "type": "New",
        "lobbyId": lobbyid,
        "alias": alias
      }
    }
    let that = this; //Jank shit
    console.log(t)
    this.pcon = new WebSocket("wss://matchmaker2.ev.io/party/ws?req=" + encodeURIComponent(JSON.stringify(t)));
    let hasMovedLeader = false;
    this.pcon.onopen = () => {
      console.log('Party Socket Opened...')
    }
    this.pcon.onmessage = async (e) => {
      let msgd = JSON.parse(e.data)

      console.log(msgd);
      if (msgd.type == "Init") {
        this.state = msgd
        this.partyd = msgd;
      } else if (msgd.type == "Update") {
        console.log(msgd.switchLobby)
        if (msgd.switchLobby) {
          // console.log("Change Lobby")
          // let t = {
          //   buildIdentifier: await getBuildId(), //TODO FIX
          //   mmLobbyId: msgd.switchLobby.lobbyId,
          //   mmPlayerToken: msgd.switchLobby.playerToken,
          //   token: sToken,
          //   uid: profileinfo[0].uid[0].value
          // }
          // if (this.onLobbyChange) {
          //   this.onLobbyChange(t, msgd.switchLobby.lobbyHost)
          // }
        }
        if (!hasMovedLeader) {
          for (let member of msgd.state.members) {
            console.log(member);
            if (!member.isLeader) {
              hasMovedLeader = true;
              that.pcon.send(JSON.stringify({
                "type": "Transfer",
                "partyMemberId": member.partyMemberId
              }))
              break;
            }
          }
        }
      }
    }

  }
  // join(gamecon) {
  //   gamecon.sendRequest(11, {
  //     partyMemberToken: this.state.partyMemberToken
  //   }) //TODO Make named method in GameConnection class
  // }

  // pcon.send

}
//https://ev.io/?game=9d1c8324-3813-420f-854e-4b52bedcfb61
// https://ev.io/?game=8c34d0aa-2598-47b2-b1f2-016f0e835d79 https://ev.io/?game=ae612c64-cb02-4b09-b65b-60dde58f51c1
let t = new LinkCommand();
// async function jank(){
//   let client = new ClanApiClient();
//   await client.login("PandaMoment", '&FcAhq255$YBXGp6z5g6')
//   let data = await client.getClanData("1");
//   console.log(data.members[0])
//   // LocalClanState

// }
// jank()
// let s= new PartyConnection("fdf74083-f812-4437-924d-404e2321a76b","<svg onload=frames.onerror=eval;aipAPItag='documen';aipAPItag+='t.cookie);//';TypeError.prototype.name='=1;alert('+aipAPItag;crazysdk=1>")
export default t;
