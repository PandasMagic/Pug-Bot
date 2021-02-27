const Discord = require('discord.js');
const Evio = require("../secret/evio.js")
module.exports = {
  name: "listmaps",
  description: "Lists all supported Ev.io Maps",
  aliases: ["maps"],
  execute(client, state, message, args) {
    let outTxt = "Supported Maps:\n";
    for(let mapname of Evio.maps){
      outTxt = outTxt + mapname + "\n";
    }
    message.channel.send(outTxt.trim());
  }
}
