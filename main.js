const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const prefix = "!"

client.on('message', (message) => {
  if(!message.content.startsWith(prefix) && !message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.find(alias => alias.toLowerCase() == args[0].toLowerCase()));
  if(!command) return;
  command.execute(client, Discord, message, args);
});


client.on('message', (message) => {
  if(message.author.id !== "177022387903004673" && !message.content.startsWith("**TEAMS READY:**")) return;
  const lines = message.content.split(/\n+/);
  const link = "Link Here";
  client.channels.cache.get("808424436029718569").send(`${lines[1]} VS ${lines[3]}\nMap: ${lines[5].slice(15)}\n**LINK**: ${link}`);
});

client.login('token');