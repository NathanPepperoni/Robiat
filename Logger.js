const logChannelID = "525143449654001664";

function sendToLogChannel(type, message) {
  message = type.toUpperCase() + ': ' + message;
  if (Logger.client) {
    let logChannel = Logger.client.channels.get(logChannelID);
    let messageString = new Date().toTimeString() + "\r\n" + message;
    logChannel.send("```" + messageString + "```");
  }
  else {
    console.log(new Date().toTimeString() + "  FATAL: could not send log message! Logger.client not set!");
  }
  console.log(new Date().toTimeString() + "  " + message);
}

class Logger {
  static logEvent(type, message) {
    sendToLogChannel(type, message);
  }
}

Logger.client;

module.exports = Logger;