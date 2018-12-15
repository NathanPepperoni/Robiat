const Discord = require('discord.js');
const fs = require("fs");
const RoyalPetWatcher = require('./RoyalPetWatcher');
const DogCommand = require('./DogCommand');
const client = new Discord.Client();
const lexCommand = new DogCommand('lex');
const clarkCommand = new DogCommand('clark');
const auth = process.env.ROBIAT_AUTH_KEY;


client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag + '!');
});

client.on('message', message => {
    var author = message.author;
    
    if (author.id === client.user.id) {
        return;
    }

    var firstChunk = message.content.split(" ")[0].toLowerCase();
    
    switch(firstChunk)
    {        
        case "!queen":
            message.channel.send('All hail the queen!\nhttps://i.imgur.com/C3Prxe4.jpg');
            return;
        
        case "!lex":
            handleLexCommand(message);
            return;

        case "!clark":
            handleClarkCommand(message);
            return;

        default:
            handleDefault(message);
            return;
    }
});

function handleDefault(message) {
    if (message.channel.id = '518101941419507712') {
        RoyalPetWatcher.processMessage(message);
    }
}

function handleLexCommand(message) {
    lexCommand.processMessage(message);
}

function handleClarkCommand(message) {
    clarkCommand.processMessage(message);
}

client.login(auth);
