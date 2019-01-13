const logChannelID = "525143449654001664";

/**
 * Logs an event to both the console and the log channel.
 * 
 * @param {String} type - The type of message. E.g. error, info, etc. 
 * @param {String} message - The message to be logged
 */
function sendToLogChannel(type, message) {
  message = type.toUpperCase() + ': ' + message;
  if (Logger.client && Logger.client.token) {
    let logChannel = Logger.client.channels.get(logChannelID);
    let messageString = new Date().toTimeString() + "\r\n" + message;
    logChannel.send("```" + messageString + "```");
  }
  else {
    console.log(new Date().toTimeString() + "  FATAL: could not send log message! Logger.client not set!");
  }
  console.log(new Date().toTimeString() + "  " + message);
}

/**
 * Logger class which should be used throughout the project. Sends info and errors to both the console, as well as the log discord channel.
 */
class Logger {

  /**
   * Logs an event to both the console and the log channel.
   * 
   * @param {String} type - The type of message. E.g. error, info, etc. 
   * @param {String} message - The message to be logged
   */
  static logEvent(type, message) {
    sendToLogChannel(type, message);
  }
}

Logger.client;

module.exports = Logger;