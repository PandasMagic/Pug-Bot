const Discord = require('discord.js');
module.exports = {
  name: "stopgame",
  description: "Stops a Ev.io Game",
  aliases: [],
  execute(client, state, message, args) {
    message.channel.send("Stopping");
  }
}
