const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
  name: "deploy",
  description: "deploy yourself",
  aliases: ["d"],
  async execute(client, state, message, args) {
    let msg = "Command List: \n"
    // for(let rawcmd of client.commands){
    //   let cmd = rawcmd[1]
    //   msg = msg + ("." + cmd.name + " : " + cmd.description + "\n") //TODO import command trigger
    // }
    // console.log(message.channel);
    if(message.channel.id != '852227947753373726' && message.channel.id != '841697686741712937'){
        return;
    }
    if(args.length <= 1){
        message.channel.send("Invalid Format use .d <playername>")
        return;
    }
    let targetUser = message.content.substr(message.content.indexOf(' ')+1);
    message.channel.send(await undeployDeploy(targetUser));
  }
}

var FormData = require('form-data');
const querystring = require('querystring');
var HTMLParser = require('node-html-parser');
const fs = require('fs');
//password
//&FcAhq255$YBXGp6z5g6
//panda moment
async function login() {

    let options = {
        withCredentials: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.37',
            'referer': "https://ev.io",
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },

    }
    axios.defaults.withCredentials = true
    let data = {
        name: 'PandaMoment',
        pass: '&FcAhq255$YBXGp6z5g6',
        form_build_id: 'form-oaozRAXJJpKjjNdtlZUuJwJnL61WiZPnqWsrB79ljLs',
        form_id: 'user_login_form',
        op: 'Log in'
    }
    let out = await axios.post('https://ev.io/user/login', querystring.encode(data), options)
    // console.log(out)
    return out.headers['set-cookie'][0];
}
async function getMembers(cookie) {
    let options = {
        withCredentials: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.37',
            'referer': "https://ev.io",
            'cookie': cookie
        },
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 302; // Reject only if the status code is greater than 302
        },

    }
    let out = await axios.get('https://ev.io/group/2/edit', options)

    // console.log(out.data)
    var root = HTMLParser.parse(out.data);
    // console.log()
    let output = {}
    for (let i of root.querySelectorAll('.checkbox')) {
        // console.log(i)
        let inputelem = i.childNodes[1].childNodes[0];
        // console.log(inputelem._attrs['name'] + ":" + inputelem._attrs['value'])
        let playerName = i.childNodes[1].childNodes[1].childNodes[0].childNodes[0].rawText
        // console.log(inputelem._attrs)
        output[playerName] = { name: inputelem._attrs['name'], value: inputelem._attrs['value'], deployed: 'checked' in inputelem._attrs, playerName: playerName }
    }
    // console.log()
    return { members: output, build_id: root.querySelector("[name='form_build_id']")._attrs['value'], form_token: root.querySelector("[name='form_token']")._attrs['value'] };
}
async function deploy(members, cookie, build_id, form_token) {
    let options = {
        withCredentials: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.37',
            'referer': "https://ev.io",
            'Content-Type': 'application/x-www-form-urlencoded',
            'cookie': cookie
        },
        maxRedirects: 0,
        validateStatus: function (status) {
            return status <= 303; // Reject only if the status code is greater than 302
        },

    }
    axios.defaults.withCredentials = true

    let data = {
        "label[0][value]": "PClan",
        "form_build_id": build_id,
        "form_token": form_token,
        "form_id": "group_clan_edit_form",
        "field_insignia[0][fids]": 2622,
        "field_insignia[0][display]": 1,
        "field_motto[0][value]": "PClient Gang (You must join our discord and post in applications to join)",
        "field_discord_link[0][uri]": "https://discord.gg/aGgkTSS3Dd",
        "op": "Save"
    }

    for (let mem of Object.values(members)) {
        data[mem.name] = mem.value;
    }
    let out = await axios.post('https://ev.io/group/2/edit', querystring.encode(data), options)
    // console.log(out)
    // console.log(out)
    return out.headers;

}
// async function test() {
//     let cookie = await login();
//     console.log(cookie)
//     let out = await getMembers(cookie)
//     let members = out['members'];
//     let deployed = {}
//     for (let mem of Object.values(members)) {
//         if (mem.deployed) {
//             deployed[mem.playerName] = mem;
//         }
//     }
//     deployed['M10653'] = members['M10653'];
//     await deploy(deployed,cookie,out['build_id'],out['form_token']);
// }

// async function test() { //Create Init file ++ add handling for modfiyfing stuff via the website

//     let cookie = await login();
//     console.log(cookie)
//     let out = await getMembers(cookie)
//     let members = out['members'];
//     let deployed = {}
//     for (let mem of Object.values(members)) {
//         if (mem.deployed) {
//             deployed[mem.playerName] = mem;
//         }
//     }
//     let to_save = {}
//     for (let mem of Object.values(members)) {
//         if(mem.deployed){
//             mem.lastDeployed = Date.now()
//         }else{
//             mem.lastDeployed = 0
//         }
//         to_save[mem.playerName] = mem;
//     }
//     fs.writeFileSync("DeployedPlayers.json",JSON.stringify(to_save));
// }
// 

async function getPlayerToUndeploy(members) {

    let deployedList = []
    for (let mem of Object.values(members)) {
        if (mem.deployed) {
            deployedList.push(mem);
        }
    }

    let longestDeployed = deployedList[0];
    // console.log(deployedList)
    for (let mem of deployedList) {
        if (longestDeployed.lastDeployed > mem.lastDeployed && mem.deployed) { //Bug if 
            longestDeployed = mem;
        }
    }
    return longestDeployed;


}

async function undeployDeploy(username) {
    let rawdata = fs.readFileSync("DeployedPlayers.json");
    let members = JSON.parse(rawdata);
    // console.log(members)

    // console.log(toRemove)
    let deployed = {}
    for (let mem of Object.values(members)) {
        if (mem.deployed) {
            deployed[mem.playerName] = mem;
        }
    }
    console.log(Object.keys(deployed).length + "/20");

    if (username in members && members[username].deployed) {
        console.log("Player Already Deployed: " + username)
        members[username].lastDeployed = Date.now();
        fs.writeFileSync("DeployedPlayers.json", JSON.stringify(members));
        return "Player Already Deployed: " + username;
    }
    let userRemoved;
    if (Object.keys(deployed).length >= 20) {
        
        let toRemove = await getPlayerToUndeploy(members);
        console.log("unDeploying Player: " + toRemove.playerName)
        delete deployed[toRemove.playerName];
        members[toRemove.playerName].deployed = false;
        userRemoved = "unDeploying Player: " + toRemove.playerName
    }


    let cookie = await login();
    // console.log(cookie)
    let out = await getMembers(cookie)
    let membersonline = out['members'];
    if (username in membersonline) {
        let toDeploy = membersonline[username];
        toDeploy.deployed = true;
        toDeploy.lastDeployed = Date.now();
        deployed[username] = toDeploy;
        console.log("Deployed: " + username);
        await deploy(deployed, cookie, out['build_id'], out['form_token']);
        fs.writeFileSync("DeployedPlayers.json", JSON.stringify(deployed))
        let toreturn = "Deployed: " + username;
        if(userRemoved){
            toreturn += "\n " + userRemoved
        }
        return toreturn;
    } else {
        // delete deployed[toRemove.playerName]; //Check if member was removed or not later
        console.log("Member not found!")
        return "Member not found!";
    }

    // let deployed = {}
    // for (let mem of Object.values(members)) {
    //     if (mem.deployed) {
    //         deployed[mem.playerName] = mem;
    //     }
    // }
    // if (deployed.length >= 20) {

    // }
}
// const prompt = require('prompt');
// prompt.start();

// prompt.get(['username'], async function (err, result) {
//     if (err) { return onErr(err); }
//     console.log('Command-line input received:');
//     console.log('  Username: ' + result.username);
//     console.log(await undeployDeploy(result.username))
// });

// function onErr(err) {
//     console.log(err);
//     return 1;
// }
// // async function test() {
// //     console.log(await undeployDeploy("SillyAW"))
// // }
// // test()
