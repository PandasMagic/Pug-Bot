const Discord = require('discord.js');
module.exports = {
  name: "help",
  description: "Displays this page",
  aliases: ["h"],
  execute(client, state, message, args) {
    let msg = "Command List: \n"
    for(let rawcmd of client.commands){
      let cmd = rawcmd[1]
      msg = msg + ("." + cmd.name + " : " + cmd.description + "\n") //TODO import command trigger
    }
    message.channel.send(msg.trim());
  }
}
