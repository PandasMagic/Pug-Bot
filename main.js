const Discord = require('discord.js');
const embeds = require('./embeds/Embeds.js')
const Evio = require("./secret/evio.js")
const pickup = require("./PickupGameStart.js")
const client = new Discord.Client();
const fs = require("fs");
const tokendata = fs.readFileSync('./secret/token.txt', 'utf8')
client.login(tokendata.trim());
class GameState {
  constructor() {
    this.gameStarted = false;
  }
}

let state = new GameState();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const prefix = "!"

client.on('message', async (message) => {
  if (message.author.bot) {
    if(message.content.includes("pickup has been started!__")){
      console.log("Found gameStart")
      // let pickupid = message.content.match(/__\*\((.*)\)\*\ \*\*/m)[1]
      let pickupid = 1;
      console.log(pickupid)
      console.log(message.mentions.users)
      let users = Array.from(message.mentions.users.values())
      console.log(users)
      let jstate = {
        users:users,
        pid: pickupid
      }
      await pickup.execute(client,jstate,message,[])
      // console.log(message.mentions.users)
      // console.log(pickupid)
    }
    console.log("New MSG");
    console.log(message);
  }
  if (!message.content.startsWith(prefix) && !message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.find(alias => alias.toLowerCase() == args[0].toLowerCase()));
  if (!command) return;
  command.execute(client, state, message, args);
});
// client.on('messageUpdate', (oldMessage, newMessage) => {
//   if (newMessage.author.bot) {
//     console.log(newMessage);
//   }
// });
async function testasdf() {

  // let search = new RegExp(/buildIdentifier[:]\'(.*?)\'/mg)
  // console.log(scriptrequest.data)
  // console.log();
  // let evclient = new Evio.EvioClient();
  // let options = new Evio.GameOptions();
  // options.mapId = Evio.mapidmap["rook"];
  // let joinlink = await evclient.startNewPrivateGame(options);
}
testasdf();
