var AWS = require('aws-sdk');
const Logger = require('./Logger');
const dogPicsTable = 'QueenMelonDogPics';
const authID = process.env.ROBIAT_AWS_ID;
const authSecret = process.env.ROBIAT_AWS_SECRET;

class DogPicDAO {
  constructor() { }

  addDogPics(dog, dogPics, callback) {
    var docClient = getDocClient();

    var updateParams = {
      TableName:dogPicsTable,
      Key: {
        dogName: dog
      },
      UpdateExpression: "set #d = list_append(#d, :vals)",
      ExpressionAttributeNames: {
        '#d': 'dogPics'
      },
      ExpressionAttributeValues: {
        ":vals": dogPics   
      },

    };
    
    docClient.update(updateParams, function(err) {
      if (err) {
        Logger.logEvent('error', err);
      }
      Logger.logEvent('info', 'Wrote AWS data: ' + JSON.stringify(dogPics, null, 2));
      callback(err);
    });
  }

  getDogPics(dog, callback) {
    var docClient = getDocClient();

    var getParams = {
      TableName:dogPicsTable,
      Key: {
        dogName: dog
      }
    };
    
    docClient.get(getParams, function(err, data) {
      if (err) {
        Logger.logEvent('error', err);
      }
      Logger.logEvent('info', 'Received AWS data: ' + JSON.stringify(data.Item.dogPics, null, 2));
      callback(data.Item);
    });
  }
}

function getDocClient() {
  AWS.config.update({
    region: "us-east-2",
    endpoint: "https://dynamodb.us-east-2.amazonaws.com",
    accessKeyId: authID,
    secretAccessKey: authSecret
  });

  return new AWS.DynamoDB.DocumentClient();
}

module.exports = DogPicDAO;