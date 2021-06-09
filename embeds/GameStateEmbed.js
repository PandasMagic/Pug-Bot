const AsciiTable = require('ascii-table')
class GameStateEmbed {
  constructor(mid) {
    this.mid = mid
    this.users = [];
    this.lastGamestate = {};
    // this.lastGamestate =
    this.updateEmbed();
  }
  update(gameState) {
    this.lastGamestate = gameState;
    this.updateEmbed();
  }
  updateEmbed() {
    console.log(this.lastGamestate)
    // console.log(this.lastGamestate.keys().
    // for(let player of Object.values(cleanState.fullGameState.players)){
    //   console.log(player)
    //   let pname = player.name;
    //   let isSpectator = player.isSpectator;
    //   let playerscore = player.playerScore;
    //   console.log(`${pname}: ${JSON.stringify(playerscore)}`)
    // }
    let redTablestr =  new AsciiTable()
    redTablestr
      .setHeading('Player', 'Kills', 'Death', 'Score')
      .addRow('Bob', 10,2,1210)
      .addRow('John', 2, 10, 240)
      .addRow('Jim', 2, 10, 210)
    let blueTablestr = null;
    let secondsLeft = Math.floor((this.lastGamestate?.roomParams?.duration - this.lastGamestate?.tick)/20)
    // console.log(cleanState.fullGameState.roomParams.duration)
    let gameTime = Math.floor((secondsLeft/60)) + ":" + secondsLeft%60;
    let mapName = this.lastGamestate?.roomParams?.mapName ?? "";
    let mapImg =  this.lastGamestate?.roomParams?.mapImage ?? "https://ev.io//sites/default/files/skin_profile_thumbs/DEFAULT_head_0.png";
    let spectators = "";
    let embed = {
      "title": "Current Match: (Click Here to Join)",
      "color": 0,
      "description": `**Match ID: 123123123123123 **\n**Map:  ${mapName}**\n**Time Remaining: ${gameTime} **`,
      "timestamp": "",
      "url": "",
      "author": {
        "name": "",
        "url": "",
        "icon_url": ""
      },
      "image": {
        "url": ""
      },
      "thumbnail": {
        "url": mapImg
      },
      "footer": {
        "text": `Match ID: ${this.mid ?? "N/A"}`,
        "icon_url": "https://ev.io//sites/default/files/skin_profile_thumbs/DEFAULT_head_0.png"
      },
      "fields": [{
          "name": "Team 1",
          "value": `\`\`\`\n${redTablestr}\`\`\``,
          "inline": false
        },
        // {
        //   "name": "Team 1",
        //   "value": `\`\`\`\n${blueTablestr}\`\`\``,
        //   "inline": false
        // },
        {
          "name": "Spectators:",
          "value": "```Player 1:\nPlaer 2:y```",
          "inline": false
        }
      ]
    }
    this.embed = embed;
  }
}
module.exports = GameStateEmbed
