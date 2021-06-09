const Discord = require('discord.js');
const AsciiTable = require('ascii-table')
const GameStateEmbed = require("../embeds/GameStateEmbed.js")
module.exports = {
  name: "e",
  description: "Ignore me",
  aliases: ["example2"],
  async execute(client, state, message, args) {
    message.channel.send("matches");
    var table = new AsciiTable()
    table
      .setHeading('Player', 'Kills', 'Death', 'Score')
      .addRow('Bob', 10, 2, 1210)
      .addRow('John', 2, 10, 240)
      .addRow('Jim', 2, 10, 210)
    // .removeBorder()

    // console.log(table.toString())
    // let embed = {
    //   "title": "Current Match:",
    //   "color": 0,
    //   "description": "**Match ID: 123123123123123 **\n**Map:  Rook**\n**Time Remaining: 3:32 **",
    //   "timestamp": "",
    //   "url": "https://ev.io//sites/default/files/skin_profile_thumbs/DEFAULT_head_0.png",
    //   "author": {
    //     "name": "",
    //     "url": "",
    //     "icon_url": ""
    //   },
    //   "image": {
    //     "url": ""
    //   },
    //   "thumbnail": {
    //     "url": "https://ev.io//sites/default/files/skin_profile_thumbs/DEFAULT_head_0.png"
    //   },
    //   "footer": {
    //     "text": "Match ID:",
    //     "icon_url": "https://ev.io//sites/default/files/skin_profile_thumbs/DEFAULT_head_0.png"
    //   },
    //   "fields": [{
    //       "name": "Team 1",
    //       "value": "```\n" + table.toString() + "\n" + table.toString()  + " ```",
    //       "inline": false
    //     },
    //     {
    //       "name": "Spectators:",
    //       "value": "```Player 1:\nPlaer 2:y```",
    //       "inline": false
    //     }
    //   ]
    // }
    let embed = new GameStateEmbed(620);
    embed.update({
      tick: 478,
      serverTick: 0,
      roundCounter: 0,
      willChangeRounds: false,
      roomParams: {
        public: false,
        playerCount: 8,
        mapId: 120,
        mapUrl: 'https://ev.io//sites/default/files/maps/_map_Sanctumcol_1345.evmap',
        gameMode: "[Object]",
        gravity: 0.07,
        dmgMultiplier: 1,
        timeScale: 1,
        duration: 4800,
        mapImage: 'https://ev.io//sites/default/files/map_large_image/sanctum.jpg',
        mapName: 'Sanctum'
      },
      players: {
        '1291': "[Object] "
      },
      events: {
        newBullets: [],
        damageEvents: []
      },
      weaponSpawns: [],
      projectiles: [],
      debugPlayerPositions: []
    })
    let currentMsg = await message.channel.send({
      embed: embed.embed
    });
  }
}
