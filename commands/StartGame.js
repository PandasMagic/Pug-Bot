const Discord = require('discord.js');
const Embeds = require("../embeds/embeds.js")
// const filter = (reaction, user) => {
//   return ['✅', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
// };
module.exports = {
  name: "startgame",
  description: "Starts A game",
  aliases: [],
  async execute(client, state, message, args) {
    let linkplayerEmbed = new Embeds.LinkPlayerEmbed();

    let currentMsg = await message.channel.send({
      embed: linkplayerEmbed.embed
    })
    await currentMsg.react('✅');
    await currentMsg.react('➡️');

    let playerlist = ["Random User"];

    const getplayercollector = currentMsg.createReactionCollector((reaction, user) => {
      return ['✅'].includes(reaction.emoji.name)
    }, {
      dispose: true
    });
    const startPicking = currentMsg.createReactionCollector((reaction, user) => {
      return ['➡️'].includes(reaction.emoji.name) && user == message.author
    }, {
      dispose: true
    });

    getplayercollector.on('collect', (reaction, user) => {
      linkplayerEmbed.addUser(user);
      currentMsg.edit({
        embed: linkplayerEmbed.embed
      })
    });
    getplayercollector.on('remove', (reaction, user) => {
      linkplayerEmbed.removeUser(user);
      currentMsg.edit({
        embed: linkplayerEmbed.embed
      })
    });

    startPicking.on('collect', async collected => {
      if (linkplayerEmbed.users.length >= 2) {
        console.log("Picking Team Leaders." + sample(linkplayerEmbed.users, 2))
        await currentMsg.reactions.removeAll()
        await message.channel.send("Picking Team Leaders." + sample(linkplayerEmbed.users, 2))

        await message.channel.send("Leaders are  ")
      }
    });

  }
}

function sample(arr, num = 1) {
  const res = [];
  for (let i = 0; i < num;) {
    const random = Math.floor(Math.random() * arr.length);
    if (res.indexOf(arr[random]) !== -1) {
      continue;
    };
    res.push(arr[random]);
    i++;
  };
  return res;
};
