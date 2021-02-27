const Discord = require('discord.js');
module.exports = {
  name: "example",
  description: "Ignore me",
  aliases: ["example2"],
  execute(client, state, message, args) {
    message.channel.send("matches");
  }
}
