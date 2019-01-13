const AWS = require('aws-sdk');
const SSM = require('aws-sdk/clients/ssm');
const Logger = require('./Logger');
const retryMax = 4;
const awsRegion = 'us-east-2';
const waitTime_ms = 5000;

let discordToken;
let awsAuthID;
let awsAuthSecret;

/**
 * Login utility class which handles the logic of connecting the bot.
 */
class LoginUtility {
  constructor() { }

  /**
   * Logs in on the passed discord client, and sets authentication for AWS services needed for the bot. Requires the following tokens to be set:
   * 
   *     discord authentication token - Will first be retrieved from /Robiat/Discord_Auth_Key, and will fall back to ROBIAT_AUTH_KEY environment variable.
   * 
   *     aws ID - Will first be retrieved from /Robiat/AWS_ID, and will fall back to ROBIAT_AWS_ID environment variable.
   * 
   *     aws secret - Will first be retrieved from /Robiat/AWS_SECRET, and will fall back to ROBIAT_AWS_SECRET environment variable.
   * 
   * @param {Object} client - The discord client on which to login. This cannot be undefined.
   */
  static login(client) {
    if (!client) {
      Logger.logEvent('error', 'Unable to login. Discord client must be defined.');
      return;
    }
    intialize(client);
  }
}

/**
 * Initializes the AWS config, attempts to set the auth tokens, and initiates login.
 * 
 * @param {Object} client - The discord client on which to login. This cannot be undefined.
 */
function intialize(client) {
  AWS.config.update({ region: awsRegion });

  const ssm = new SSM()

  var params = {
    Names: [
      '/Robiat/Discord_Auth_Key',
      '/Robiat/AWS_ID',
      '/Robiat/AWS_SECRET',
    ],
    WithDecryption: true
  };

  ssm.getParameters(params, function (err, data) {
    if (err) {
      Logger.logEvent('info', 'Unable to retrieve AWS parameter store values. Attempting to login with local environment variables.');
      discordToken = process.env.ROBIAT_AUTH_KEY;
      awsAuthID = process.env.ROBIAT_AWS_ID;
      awsAuthSecret = process.env.ROBIAT_AWS_SECRET;
    }
    else {
      setAuthVariables(data['Parameters']);
    }

    AWS.config.update({
      endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
      accessKeyId: awsAuthID,
      secretAccessKey: awsAuthSecret
    });

    login(client);
  });
}

/**
 * Attempts to set the auth tokens from the passed parameters. If a parameter is missing, the auth value will be left undefined.
 * 
 * @param {Object[]} parameters 
 */
function setAuthVariables(parameters) {
  const keys = {};

  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];
    keys[parameter.Name] = parameter.Value;
  }

  discordToken = keys['/Robiat/Discord_Auth_Key'];
  awsAuthID = keys['/Robiat/AWS_ID'];
  awsAuthSecret = keys['/Robiat/AWS_SECRET'];
}

/**
 * Recursively attempts to login. Will repeat attempts until the set max is met.
 * 
 * @param {Object} client - The discord client on which to login. This cannot be undefined.
 * @param {int} attemptCount - The current number of attempts. Defaults to 0.
 */
function login(client, attemptCount = 0) {
  if (!discordToken) {
    Logger.logEvent('error', 'Could not retrieve discord auth token.');
    return;
  }
  if (attemptCount >= retryMax) {
    Logger.logEvent('error', 'Could not reconnect to discord server.');
    return;
  };
  client.login(discordToken)
    .catch(reason => {
      attemptCount += 1;
      Logger.logEvent('error', reason);
      Logger.logEvent('info', 'Reconnection attempt number ' + attemptCount);
      setTimeout(() => { 
        login(client, attemptCount);
      }, waitTime_ms);
    });
}

module.exports = LoginUtility;