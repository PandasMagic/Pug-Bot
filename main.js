const Discord = require('discord.js');
const client = new Discord.Client();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const prefix = "!"

client.on('message', (message) => {
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.toLowerCase() == args[0].toLowerCase());
    if(!command) message.reply(`No such command found for \`${Discord.Util.cleanContent(prefix + args[0].toLowerCase(), message)}\``);
    command.execute(client, Discord, message, args);
});

client.login('token');
