import Discord from 'discord.js'
import BotState from './BotState'
import Command from './command'
import fs from 'fs';
import LocalClanState from './util/LocalClanState';
import ClanApiClient from './util/ClanApiClient';

let state = new BotState()
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js') || file.endsWith('.ts')); //Load commands
for (const file of commandFiles) {
  console.log(file)
  let command: Command = require(`./commands/${file}`);
  if("default" in command){
    command = command['default']
  }
  state.commands.set(command.name, command);
}

const client = new Discord.Client();
const tokendata = fs.readFileSync('./secret/token.txt', 'utf8')
client.login(tokendata.trim());

state.clanState = new LocalClanState('clanstate.json');
state.clanClient = new ClanApiClient();
state.clanClient.login('PandaMoment', '&FcAhq255$YBXGp6z5g6');


client.on('message', async (message) => {
  if(!message.content.startsWith(state.prefix)){
    console.log(message.content)
    return;
  }
  if(message.member.user.bot){
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
