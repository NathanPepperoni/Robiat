var AWS = require('aws-sdk');
const Logger = require('./Logger');
const dogPicsTable = 'QueenMelonDogPics';

class DogPicDAO {
  constructor() { }

  addDogPics(dog, dogPics, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    var updateParams = {
      TableName: dogPicsTable,
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

    docClient.update(updateParams, function (err) {
      if (err) {
        Logger.logEvent('error', err);
      }
      Logger.logEvent('info', 'Wrote AWS data: ' + JSON.stringify(dogPics, null, 2));
      callback(err);
    });
  }

  getDogPics(dog, callback) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    var getParams = {
      TableName: dogPicsTable,
      Key: {
        dogName: dog
      }
    };

    docClient.get(getParams, function (err, data) {
      if (err) {
        Logger.logEvent('error', err);
      }
      Logger.logEvent('info', 'Received AWS data: ' + JSON.stringify(data.Item.dogPics, null, 2));
      callback(data.Item);
    });
  }
}

module.exports = DogPicDAO;