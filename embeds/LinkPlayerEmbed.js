class LinkPlayerEmbed {
  constructor() {
    this.users = []
    this.embed = {
      "title": "Link Players to TDM",
      "color": 16711680,
      "description": "",
      "timestamp": "",
      "author": {
        "name": "",
        "url": "",
        "icon_url": "https://ev.io//sites/default/files/skin_profile_thumbs/DEFAULT_head_0.png"
      },
      "image": {
        "url": ""
      },
      "thumbnail": {
        "url": ""
      },
      "footer": {
        "text": "Press ✅ To join the game\nPress ➡️ to Lock in teams.('Creator Only')",
        "icon_url": ""
      },
      "fields": []
    }
  }
  addUser(user) {
    this.users.push(user);
    this.updateEmbed();
  }
  removeUser(user) {
    this.users = this.users.filter(f => f !== user)
    this.updateEmbed();
  }
  updateEmbed() {
    let out = []
    let num = 1
    for (let user of this.users) {
      let toadd = {
        "name": "Player " + num++,
        "value": user,
        "inline": true
      }
      out.push(toadd);
    }
    this.embed.fields = out;
  }
}
module.exports = LinkPlayerEmbed
