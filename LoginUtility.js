const AWS = require('aws-sdk');
const SSM = require('aws-sdk/clients/ssm');
const Logger = require('./Logger');
const retryMax = 4;
const awsRegion = 'us-east-2';

let discordToken;
let awsAuthID;
let awsAuthSecret;

class LoginUtility {
  constructor() { }

  static login(client) {
    intialize(client);
  }
}

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

  ssm.getParameters(params, function(err, data) {
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
    Logger.logEvent('error',reason);
    Logger.logEvent('info', 'Reconnection attempt number ' + attemptCount);
    login(client, attemptCount);
    setTimeout(() => {return}, 5000);
  });
}

module.exports = LoginUtility;