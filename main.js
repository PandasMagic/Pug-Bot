const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', (message) => {
    
    if(message.content === 'test') {
        message.reply('test');
        msg.channel.send(`test`);
    }

});

client.login('token');
