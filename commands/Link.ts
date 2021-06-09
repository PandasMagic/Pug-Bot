module.exports = {
  name: "link",
  description: "Displays this page",
  aliases: ["verify"],
  execute(client, state, message, args) {
    // for(let rawcmd of client.commands){
    //   let cmd = rawcmd[1]
    //   msg = msg + ("." + cmd.name + " : " + cmd.description + "\n") //TODO import command trigger
    // }
    message.channel.send("Link request detected. Check your Dm's");
    // message.
  }
}
