// const Discord = require('discord.js');
import Discord from 'discord.js'
import embeds from './embeds/Embeds.js'
import fs from 'fs';
// const Evio = require("./secret/evio.js")
// const pickup = require("./PickupGameStart.js")
const client = new Discord.Client();
// const fs = require("fs");
const tokendata = fs.readFileSync('./secret/token.txt', 'utf8')
client.login(tokendata.trim());
// class GameState {
//   gameStarted : boolean;
//   constructor() {
//     this.gameStarted = false;
//   }
// }

// let state = new GameState();
let commands : Discord.Collection<any, any> = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of commandFiles) {
  console.log(file)
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

const prefix = "!"

client.on('message', async (message) => {
  let players = Array.from(message.mentions.users.values());
  // console.log(players.size)
  // if(players.size > 0 && !message.author.bot){
  //   console.log(players)
  //   message.channel.send("hello" + players.values()))
  // }

  // if (message.author.bot && message.embeds.length > 0) {
  //   let tcheck = "__**1v1** is started!__"
  //   let embed = message.embeds[0]
  //   if(embed.title == tcheck){
  //     let mid = embed.footer.text.split(": ")[1]
  //     // let players = Array.from(message.mentions.users.values());
  //     console.log(embed.fields[0].value)
  //     let pids = embed.fields[0].value.match(/(?<=<@)([\w]+)(?=>)/gm)
  //     console.log(pids)
  //     let players = []
  //     for(let pid of pids){
  //       players.push(await client.users.fetch(pid))
  //     }
  //     console.log(players)
  //     // let players = client.users.cache.find(user => pids.includes(user.id))
  //     // message.channel.send(players)
  //     // console.log(message)
  //     // console.log(embed)
  //     // console.log(players)
  //     let winners = await pickup.execute(client,null,message,[players])
  //     message.channel.send("!rw " + mid + " alpha");
  //   }

  //   // if(message.content.includes("pickup has been started!__")){
  //   //   console.log("Found gameStart")
  //   //   // let pickupid = message.content.match(/__\*\((.*)\)\*\ \*\*/m)[1]
  //   //   let pickupid = 1;
  //   //   console.log(pickupid)
  //   //   console.log(message.mentions.users)
  //   //   let users = Array.from(message.mentions.users.values())
  //   //   console.log(users)
  //   //   let jstate = {
  //   //     users:users,
  //   //     pid: pickupid
  //   //   }
  //   //   await pickup.execute(client,jstate,message,[])
  //   //   // console.log(message.mentions.users)
  //   //   // console.log(pickupid)
  //   // }
  //   console.log("New MSG");
  //   // console.log(message);
  // }
  // if (!message.content.startsWith(prefix) && !message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = commands.get(args[0]) || commands.find(cmd => cmd.aliases && cmd.aliases.find(alias => alias.toLowerCase() == args[0].toLowerCase()));
  if (!command) return;
  let state = null;
  command.execute(client, state, message, args);
});
// client.on('messageUpdate', (oldMessage, newMessage) => {
//   if (newMessage.author.bot) {
//     console.log(newMessage);
//   }
// });
// async function testasdf() {

//   // let search = new RegExp(/buildIdentifier[:]\'(.*?)\'/mg)
//   // console.log(scriptrequest.data)
//   // console.log();
//   let evclient = new Evio.EvioClient();
//   let options = new Evio.GameOptions();
//   options.mapId = Evio.mapidmap["rook"];
//   // let joinlink = await evclient.startNewPrivateGame(options);
//   let joinlink = await evclient.joinGamelink("https://ev.io/?game=edbc7cc1-be88-47de-86b0-991ffe5f4b89");
//   console.log(joinlink)
// }
// testasdf();
