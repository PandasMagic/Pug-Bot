const Discord = require('discord.js');
const Embeds = require("../embeds/Embeds.js")
const Evio = require("../secret/evio.js")
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

const maps = {"1️⃣": "Celarus", "2️⃣": "Sanctum", "3️⃣": "Bishop", "4️⃣": "Evasion", "5️⃣": "Fracture", "6️⃣": "Checkpoint"}

module.exports = {
  name: "startgame",
  description: "Starts A game",
  aliases: [],
  async execute(client, state, message, args) {
    let currentMsg = await message.channel.send({
      embed: emptyEmbed
    });
    console.log(args)
    let tmp = await pickPlayers(currentMsg)
    let leaders = tmp.leaders;
    let players = tmp.players;
    message.channel.send("Leaders " + leaders)
    let evclient = new Evio.EvioClient();
    let options = new Evio.GameOptions();

    options.mapId = parseInt(args[1])
    let joinlink = await evclient.startNewPrivateGame(options);
    message.channel.send(joinlink)

    // if (players.length > 2){
    //   await pickTeams();
    // }
    // let map = await voteMap();
    // let tmp = await pickPlayers(currentMsg, message)
    // let leaders = tmp.leaders;
    // let players = tmp;
    // if (players.length > 2){
    //   await pickTeams();
    // }
    // let map = await voteMap(currentMsg, tmp);
    // currentMsg.edit(`**MAP**: **${map}**`)



  }
}
async function voteMap(message, users){
  return new Promise(async (resolve,reject) => {
    let emojis = Object.keys(maps)
    let mapNames = Object.values(maps)
    const voteMessage = await message.edit(`**MAP VOTE**\n${emojis[0]} - ${mapNames[0]}\n${emojis[1]} - ${mapNames[1]}\n${emojis[2]} - ${mapNames[2]}\n${emojis[3]} - ${mapNames[3]}\n${emojis[4]} - ${mapNames[4]}\n${emojis[5]} - ${mapNames[5]}`)
    emojis.forEach(async (emoji) => { await voteMessage.react(emoji) })
    const filter = (reaction, user) => {
      return emojis.includes(reaction.emoji.name) && users.map(user => user.id).includes(user.id)
    }
    var collector = voteMessage.createReactionCollector(filter, { max: users.size })
    const votes = {voters:[]}
    mapNames.forEach(map => votes[map] = [])
    collector.on('collect', (reaction, user) => {
      if(votes.voters.includes(user.id)) Object.keys(votes).forEach(map => { if(votes[map].includes(user.id)) votes[map] = votes[map].filter(it => it != user.id) })
      votes[maps[reaction.emoji.name]].push(user.id)
      votes.voters.push(user.id)
      reaction.users.remove(user.id)
      if(votes.voters.length == users.length) collector.stop()
    })
    collector.on('end', collected => {
      const voteRes = new Discord.Collection()
      for (var key in votes) {
        if(key != 'voters') {
          voteRes.set(key, votes[key].length)
        }
      }
      voteRes.sort((a, b) => b - a)
      message.reactions.removeAll()
      resolve(voteRes.firstKey())
    })
  })
}
async function pickTeams(){
  return new Promise(async (resolve,reject) =>{

  })
}
async function pickPlayers(currentMsg, message){
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
      return ['➡️'].includes(reaction.emoji.name) && user.id == message.author.id
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
        console.log("Picking Team Leaders." + sample(linkplayerEmbed.users, 2));
        await currentMsg.reactions.removeAll();
        let out = {
          players: linkplayerEmbed.users,
          teamleaders: sample(linkplayerEmbed.users, 2)
        }
        startPicking.stop();
        getplayercollector.stop();
        resolve(linkplayerEmbed.users);
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
