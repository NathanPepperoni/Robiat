const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();
const auth = process.env.ROBIAT_AUTH_KEY;


var scoreBoard = {};
var clarkPics = [];
var lexPics = [];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    lexPics = loadDogPics('lexPics.dog');
    clarkPics = loadDogPics('clarkPics.dog');
});

client.on('message', message => {
    var author = message.author;
    
    if (author.id === client.user.id) {
        return;
    }

    var firstChunk = message.content.split(" ")[0].toLowerCase();
    
    switch(firstChunk)
    {
        case "!rank":
            message.reply("your ACTUAL score is: " + scoreBoard[author] + ", server rank: " + getRank(author));
            return;

        case "!fairbot -info":
            message.reply("This bot is meant to usurp the unfair tatsumaki bot.\nInstead of assigning points randomly, points are determined by values intrinsic to you as a user, like real life.");
            return;
        
        case "!queen":
            message.reply("All hail the queen!\nhttps://i.imgur.com/C3Prxe4.jpg");
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
    var author = message.author;
    var points = getPoints(message);

    if (scoreBoard[author]) {
        scoreBoard[author] = scoreBoard[author] + points;
    }
    else {
        scoreBoard[author] = points;
    }
}

function handleLexCommand(message) {
    var content = message.content;

    if (content.substring(0, 9) === "!lex -add") {
        lexPics = lexPics.concat(parsePics(message.channel, content.substring(9), "lex"));
        return;
    }

    var lexPic = lexPics[Math.floor(Math.random()*lexPics.length)]
    message.channel.send({file: lexPic});
}

function handleClarkCommand(message) {
    var content = message.content;

    if (content.substring(0, 11) === "!clark -add") {
        clarkPics = clarkPics.concat(parsePics(message.channel, content.substring(11), "clark"));
        return;
    }

    var clarkPic = clarkPics[Math.floor(Math.random()*clarkPics.length)]
    message.channel.send({file: clarkPic});
}

function parsePics(channel, imagesString, type) {
    splitImages = imagesString.split(",");
    images = splitImages.length != 0 ? splitImages : imagesString;

    var newPics = [];
    for (image in images) {
        newPics.push(images[image].trim());
    }
    channel.send("added " + newPics.length + " new " + type + "  pic(s)!");

    return newPics;
}

// this is a really dumb way to do this
function getRank(author) {
    var scoreList = [];
    for (var score in scoreBoard) {
        scoreList.push([score, scoreBoard[score]]);
    }

    scoreList.sort(function (a, b) {
        return a[1] - b[1];
    });

    console.log(scoreBoard);

    scoreList = scoreList.reverse();
    var rank = 1;
    for (i = 0; i < scoreList.length; i++) {
        if (scoreList[i][0] == author) {
            console.log("list: " + scoreList);
            return rank;
        }
        rank++;
    }
}

function loadDogPics(dogFile) {
    var dogData = fs.readFileSync(dogFile).toString();
    var splitData = dogData.split('\n');

    for (data in splitData) {
        splitData[data] = splitData[data].trim();
    }
    return splitData.length > 0 ? splitData : [dogData];
}

function getPoints(msg) {
    var name = msg.author.username.toLowerCase();
    var points = 1;
    for (character in name) {
        var value = name.charCodeAt(character);
        points = (points*name.charCodeAt(character)) % 100 + 1;
    }
    return points % 5 + 1;
};

client.login(auth);
