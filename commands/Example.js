module.exports = {
  name: "test",
  description: "Example Command",
  aliases: ["example"],
  execute(client, Discord, message, args) {
    message.channel.send("Hi!")
  }
}
