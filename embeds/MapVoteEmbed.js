class MapVoteEmbed {
  constructor(users, maps) {
    this.uservotemap = {}
    this.users = users;
    for (let map of maps) {
      this.uservotemap[map] = [];
    }
    this.totalVotes = 0;
    console.log(this.uservotemap)
    this.embed = {
      "title": "Map Voting (0/" + users.length + ")",
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
        "text": "",
        "icon_url": ""
      },
      "fields": []
    }
    this.updateEmbed();
  }
  vote(user, map) {

    for(let users of Object.values(this.uservotemap)){
      if(users.includes(user)){
        users.splice(users.indexOf(user), 1)
        this.numVotes = this.numVotes -1;
      }
    }
    this.uservotemap[map].push(user)
    this.numVotes = this.numVotes + 1;
    this.updateEmbed();
  }
  getVotedMap() {
    let keys = Object.keys(this.uservotemap)
    let largest = Math.max.apply(null, keys.map(x => this.uservotemap[x].length))
    let result = keys.reduce((result, key) => { if (this.uservotemap[key].length === largest){ result.push(key); } return result; }, []);
    return result[Math.floor(Math.random() * result.length)];;
  }
  isDoneVoting(){
    return this.totalVotes == this.users.length;
  }
  updateEmbed() {
    // let unvotedUsers = [];
    this.totalVotes = 0;
    let fields = []
    for (let map of Object.keys(this.uservotemap)) {
      // if (this.uservotemap[map].length > 0) {
      this.totalVotes = this.totalVotes + this.uservotemap[map].length;
      let toadd = {
        "name": map,
        "value": "(" + this.uservotemap[map].length + "/" + this.users.length + "): " + this.uservotemap[map],
        "inline": true
      }
      fields.push(toadd);
    }
    this.embed.fields = fields;
    this.embed.title = "Map Voting (" + this.totalVotes + "/" + this.users.length + ")"
  }
}
module.exports = MapVoteEmbed
