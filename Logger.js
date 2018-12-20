const logChannelID = "525143449654001664";

function sendToLogChannel(type, message) {
  var messageString = new Date().toTimeString() + "\r\n" + type.toUpperCase() + ': ' + message;
  if (Logger.client) {
    var logChannel = Logger.client.channels.get(logChannelID);
    logChannel.send("```" + messageString + "```");
  }
  else {
    console.log(new Date().toTimeString() + "\r\nFATAL: could not send log message! Logger.client not set!");
  }
  console.log(messageString);
}

class Logger {
  static logEvent(type, message) {
    sendToLogChannel(type, message);
  }
}

Logger.client;

module.exports = Logger;