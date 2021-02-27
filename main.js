const Discord = require('discord.js');
const embeds = require('./embeds/Embeds.js')
const client = new Discord.Client();
const fs = require("fs");
const tokendata = fs.readFileSync('./secret/token.txt', 'utf8')
client.login(tokendata.trim());
class GameState {
  constructor(){
    this.gameStarted = false;
  }
}

let state = new GameState();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const prefix = "."

client.on('message', (message) => {
  if(!message.content.startsWith(prefix) && !message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.find(alias => alias.toLowerCase() == args[0].toLowerCase()));
  if(!command) return;
  command.execute(client, state, message, args);
});
