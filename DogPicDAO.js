var AWS = require('aws-sdk');
const Logger = require('./Logger');
const dogPicsTable = 'QueenMelonDogPics';

/**
 * Abstraction layer for accessing DogPic backend.
 */
class DogPicDAO {
  constructor() { }

  /**
   * Adds pics to a dog in the backend.
   * 
   * @param {String} dog - name of the dog to add the pics to (e.g. marshmallow, lex, clark)
   * @param {String[]} dogPics - list of urls pointing to dog pictures to add to the dog
   * @param {function} callback - callback
   */
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

  /**
   * Retrieves the list of pictures related to a given dog.
   * 
   * @param {String} dog - name of the dog to add the pics to (e.g. marshmallow, lex, clark)
   * @param {function} callback - callback through which the data will be returned
   */
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