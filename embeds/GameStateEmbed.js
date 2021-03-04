const AsciiTable = require('ascii-table')
class GameStateEmbed {
  constructor() {
    this.users = [];
    this.lastGamestate = {};
    this.embed = {
      "color": 0,
      "timestamp": "",
      "author": {},
      "image": {},
      "thumbnail": {},
      "footer": {},
      "fields": []
    };
    update(gameState) {
      this.lastGamestate = gameState;
      this.updateEmbed();
    }
    updateEmbed() {
      let redTablestr = null;
      let blueTablestr = null;
      let gameTime = '';
      let mapName = "";
      let mapImg = "";
      let spectators = "";
      let embed = {
        "title": "Current Match: (Click Here to Join)",
        "color": 0,
        "description": `**Match ID: 123123123123123 **\n**Map:  ${mapName}**\n**Time Remaining: ${gameTime} **`,
        "timestamp": "",
        "url": "https://ev.io//sites/default/files/skin_profile_thumbs/DEFAULT_head_0.png",
        "author": {
          "name": "",
          "url": "",
          "icon_url": ""
        },
        "image": {
          "url": ""
        },
        "thumbnail": {
          "url": "https://ev.io//sites/default/files/skin_profile_thumbs/DEFAULT_head_0.png"
        },
        "footer": {
          "text": "Match ID:",
          "icon_url": "https://ev.io//sites/default/files/skin_profile_thumbs/DEFAULT_head_0.png"
        },
        "fields": [{
            "name": "Team 1",
            "value": `\`\`\`\n${redTablestr}\`\`\``,
            "inline": false
          },
          {
            "name": "Team 1",
            "value": `\`\`\`\n${blueTablestr}\`\`\``,
            "inline": false
          },
          {
            "name": "Spectators:",
            "value": "```Player 1:\nPlaer 2:y```",
            "inline": false
          }
        ]
      }
    }
  }
  module.exports = GameStateEmbed
