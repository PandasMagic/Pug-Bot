const Discord = require('discord.js');
module.exports = {
  name: "stopgame",
  description: "Starts A game",
  aliases: [],
  execute(client, state, message, args) {
    message.channel.send("Stopping");
  }
}
