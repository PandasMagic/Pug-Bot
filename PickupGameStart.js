const Discord = require('discord.js');
const Embeds = require("./embeds/Embeds.js")
const Evio = require("./secret/evio.js")
let emptyEmbed = [{
  "color": 0,
  "timestamp": "",
  "author": {},
  "image": {},
  "thumbnail": {},
  "footer": {},
  "fields": []
}]

module.exports = {
  name: "startgame",
  description: "Starts an ev.io Game",
  aliases: [],
  async execute(client, state, message, args) {
    let currentMsg = await message.channel.send({
      embed: emptyEmbed
    });

    // let tmp = await pickPlayers(currentMsg, message)
    let players = []
    if(args.length == 0){
      players = await pickPlayers(currentMsg, message)
    }else{
      players = args[0]
    }
    console.log("Trigger")
    // console.log(tmp)
    let map = await voteMap(currentMsg, players);
    currentMsg.edit(`**MAP**: **${map}**`)
    let evclient = new Evio.EvioClient();
    let options = new Evio.GameOptions();
    console.log(map.split(" ")[1].replace(":",""))
    console.log(Evio.mapidmap[map.split(" ")[1].replace(":","")])
    options.mapId = Evio.mapidmap[map.split(" ")[1].replace(":","")];
    let joinlink = await evclient.startNewPrivateGame(options);
    message.channel.send(joinlink)
  }
}
async function voteMap(message, users) {
  return new Promise(async (resolve, reject) => {
    let emojis = []
    let mapNames = [...Evio.maps]
    let emoteMap = {}
    for (let i in mapNames) {
      let emote = message.guild.emojis.cache.find(emoji => emoji.name == mapNames[i].toLowerCase())
      emojis.push(emote);
      mapNames[i] = `${emote} ${mapNames[i]}: `
      emoteMap[emote] = mapNames[i]
    }
    let mapVoteEmbed = new Embeds.MapVoteEmbed(users, mapNames);
    await message.edit({
      embed: mapVoteEmbed.embed
    })
    emojis.forEach(async (emoji) => {
      await message.react(emoji)
    })
    const filter = (reaction, user) => {
      return emojis.includes(reaction.emoji) && users.map(user => user.id).includes(user.id) && user.id != message.author.id
    }
    var collector = message.createReactionCollector(filter, {
      max: users.size
    })
    collector.on('collect', (reaction, user) => {
      console.log("Collect:")
      mapVoteEmbed.vote(user, emoteMap[reaction.emoji])
      message.edit({
        embed: mapVoteEmbed.embed
      })
      reaction.users.remove(user.id)
      if (mapVoteEmbed.isDoneVoting()) collector.stop()
    })
    collector.on('end', collected => {
      message.reactions.removeAll()
      resolve(mapVoteEmbed.getVotedMap());
    })
  })
}
async function pickTeams() {
  return new Promise(async (resolve, reject) => {

  })
}
async function pickPlayers(currentMsg, message) {
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
