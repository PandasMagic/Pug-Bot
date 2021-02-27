const Discord = require('discord.js');
module.exports = {
  name: "here",
  description: "Example Command",
  aliases: ["example"],
  execute(client, state, message, args) {
    message.channel.send("matches");
  }
}
