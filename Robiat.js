const Discord = require('discord.js');
const RoyalPetWatcher = require('./RoyalPetWatcher');
const DogCommand = require('./DogCommand');
const Logger = require('./Logger');
const os = require('os');
const LoginUtility = require('./LoginUtility');

const client = new Discord.Client();
const lexCommand = new DogCommand('lex');
const clarkCommand = new DogCommand('clark');
const marshCommand = new DogCommand('marshmallow');

client.on('ready', () => {
  Logger.client = client;
  Logger.logEvent('info', `Initialized on ${getHost()}`);
});

client.on('error', error => {
  Logger.logEvent('error', JSON.stringify(error));
  LoginUtility.login(client);
});

client.on('resume', () => {
  Logger.logEvent('info', `Reconnected on ${getHost()}`);
})

function getHost() {
  return `${os.hostname()} (${os.type()} ${os.release()})`
}

client.on('message', message => {
  var author = message.author;

  if (author.id === client.user.id) {
    return;
  }

  var firstChunk = message.content.split(" ")[0].toLowerCase();

  switch (firstChunk) {
    case "!queen":
      message.channel.send('All hail the queen!\nhttps://i.imgur.com/C3Prxe4.jpg');
      return;

    case "!mrag":
      message.channel.send('THE DARK MRAG\nhttps://i.imgur.com/BqSF5NO.png');
      //forbidden mrag: message.channel.send('MRAG\nhttps://i.imgur.com/Qwp7TRi.png');
      return;

    case "!celebrate":
      message.channel.send('I cannot celebrate. I am a robot.');
      setTimeout(() => {
        message.channel.send('JUST KIDDING LETS ROBO BOOGY');
        message.channel.send({
          files: ['https://media.giphy.com/media/1Mng0gXC5Tpcs/giphy.gif']
        })
      }, 5000);
      return;

    case "!hohoho":
      message.channel.send('ho ho ho!');
      message.channel.send({ file: "https://media.giphy.com/media/cc3FdmGSrr35C/giphy.gif" });
      return;

    case "!lex":
      lexCommand.processMessage(message);
      return;

    case "!clark":
      clarkCommand.processMessage(message);
      return;

    case "!marshmallow":
      marshCommand.processMessage(message);
      return;

    case "!dan":
      handleDanCommand(message);
      return;

    default:
      handleDefault(message);
      return;
  }
});

/**
 * Processes the command when no other command matches were found.
 * 
 * @param {String} message - The full command
 */
function handleDefault(message) {
  if (message.channel.id === '518101941419507712') {
    RoyalPetWatcher.processMessage(message);
  }
  if (message.content.includes('<@213098512798187521>')) {
    handleDanCommand(message);
  }
}

/**
 * Processes the dan command.
 * @param {String} message - The full command
 */
function handleDanCommand(message) {
  if (message.guild.id === '524282560260603905') {
    message.channel.send("did someone say Dan?");
    message.channel.send({ file: "http://www.rednovalabs.com/images/team/dan-stucky/funny.jpg" });
  }
}

LoginUtility.login(client);