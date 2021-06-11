import Discord from 'discord.js'
import BotState from './BotState'
import Command from './command'
import fs from 'fs';
import LocalClanState, { LocalMemberData } from './util/LocalClanState';
import ClanApiClient from './util/ClanApiClient';
import { inherits } from 'util';

let state = new BotState()
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js') || file.endsWith('.ts')); //Load commands
for (const file of commandFiles) {
  console.log(file)
  let command: Command = require(`./commands/${file}`);
  if ("default" in command) {
    command = command['default']
  }
  state.commands.set(command.name, command);
}
const client = new Discord.Client();
const tokendata = fs.readFileSync('./secret/token.txt', 'utf8')
client.login(tokendata.trim());
init();
async function init() {


  state.clanState = new LocalClanState('clanstate.json');
  state.clanClient = new ClanApiClient();
  await state.clanClient.login('PandaMoment', '&FcAhq255$YBXGp6z5g6');
  autoDeploy();
  setInterval(() => {
    autoDeploy();
  }, 1000 * 60 * 4);
}


async function autoDeploy() {
  console.log("autoDeploy")
  state.clanState.update(await state.clanClient.getClanData('2'));

  for (let m of state.clanState.clanData.members) {
    let stats = await ClanApiClient.getPlayerStats(m.name);
    let weeklyscore = stats['field_weekly_score'][0]['value'];
    if (m.weeklyScore != weeklyscore) {
      console.log("Score Change Detected for:" + m.name + " : +" + (weeklyscore - m.weeklyScore));
      m.lastPointUpdated = Date.now();
      m.lastDeployed = Date.now();
      if (!m.deployed) {
        // state.clanClient.updateClanStatus(this.st)
        let toUndeploy = getPlayerToUndeploy(state.clanState.clanData.members);
        m.deployed = true;
        if (toUndeploy) {
          toUndeploy.deployed = false;
        }
        state.clanClient.updateClanStatus(state.clanState.generateClanStatus());
        let msg = "Deployed: " + m.name;
        if (toUndeploy) {
          msg += "\nUndeploying: " + toUndeploy.name;
        }
        msg += "\nMake sure to refresh your game to start earning CP. (just waiting untill a new game does not update it)";
        console.log(msg)
      }
    }
    m.weeklyScore = weeklyscore;
  }
  state.clanState.save();

  console.log("The Following users who active in the past 11 min");
  for (let m of state.clanState.clanData.members) {

    let last11min = (Date.now() - 1000 * 60 * 11);
    // console.log(m.lastPointUpdated)
    // console.log(last11min)
    if (m.lastPointUpdated > last11min) {
      console.log(m.name + ": " + m.deployed);
    }
  }

  // state.clanClient.getPlayerStats())
}
function getPlayerToUndeploy(members: LocalMemberData[]): LocalMemberData {

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

client.on('message', async (message) => {
  if (!message.content.startsWith(state.prefix)) {
    // console.log(message.content)
    return;
  }
  if (message.member.user.bot) {
    return;
  }
  if (message.channel.id != '852227947753373726' && message.channel.id != '841697686741712937') { //whitelist two channels thats it
    return;
  }

  const args = message.content.slice(state.prefix.length).trim().split(/ +/);
  const command = state.commands.get(args[0]) || state.commands.find(cmd => cmd.aliases != null && cmd.aliases.find(alias => alias.toLowerCase() == args[0].toLowerCase()) != undefined);
  if (!command) return;
  command.execute(client, state, message, args);
});
