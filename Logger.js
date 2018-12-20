const logChannelID = "525143449654001664";

function sendToReniat(type, message) {
    var messageString = type.toUpperCase() + ': ' + message;
    if (Logger.client) {
        var reniat = Logger.client.channels.get(logChannelID);
        reniat.send(messageString);
    }
    else {
        console.log("FATAL: could not send log message! Logger.client not set!");
    }
    console.log(messageString);
}

class Logger {

    static logEvent(type, message) {
        sendToReniat(type, message);
    }
}

Logger.client;

module.exports = Logger;