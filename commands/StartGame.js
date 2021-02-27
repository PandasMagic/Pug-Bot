const Discord = require('discord.js');
const Embeds = require("../embeds/embeds.js")
let emptyEmbed = [
    {
      "color": 0,
      "timestamp": "",
      "author": {},
      "image": {},
      "thumbnail": {},
      "footer": {},
      "fields": []
    }
  ]
module.exports = {
  name: "startgame",
  description: "Starts A game",
  aliases: [],
  async execute(client, state, message, args) {
    let currentMsg = await message.channel.send({
      embed: emptyEmbed
    });
    let tmp = await pickPlayers(currentMsg)
    let leaders = tmp.leaders;
    let players = tmp.players;
    if (players.length > 2){
      await pickTeams();
    }
    let map = await voteMap();



  }
}
async function voteMap(){
  return new Promise(async (resolve,reject) =>{

  })
}
async function pickTeams(){
  return new Promise(async (resolve,reject) =>{

  })
}
async function pickPlayers(currentMsg){
  return new Promise(async (resolve, reject) => {
    let linkplayerEmbed = new Embeds.LinkPlayerEmbed();
    await currentMsg.edit({
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
      return ['➡️'].includes(reaction.emoji.name) && user == currentMsg.author
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
        let out = {
          players: linkplayerEmbed.users,
          teamleaders: sample(linkplayerEmbed.users, 2)
        }
        resolve(linkplayerEmbed.users)
      }
    });
  });
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
