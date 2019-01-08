const DogPicDAO = require('./DogPicDAO');
const Logger = require('./Logger');
const dogPicDAO = new DogPicDAO();

class DogCommand {

  /**
   * Constructs a DogCommand object.
   * 
   * @param {String} dog - The dog on which to process the commands. This cannot be empty or undefined.
   */
  constructor(dog) {
    this.dog = dog;
  }

  /**
   * Takes a command and processes it in relation to the dog set on the DogCommand object. This will do nothing if the DogCommand object was created with an empty or undefined dog.
   * 
   * @param {String} message - The full command to process
   */
  processMessage(message) {
    if (this.dog) {
      Logger.logEv
      return;
    }
    handleDogCommand(message, this.dog);
  }
}

/**
 * Processes the command in relation to the given dog.
 * 
 * @param {String} message - The full command to process
 * @param {String} dog - The dog to use as refererence when processing the command
 */
function handleDogCommand(message, dog) {

  var content = message.content;

  var flag = content.split(" ")[1];

  // who has time for an actual grammar?
  if (flag && flag.trim().toLowerCase() === "-add") {
    handleAddCase(message, dog);
    return;
  }

  if (content === "!" + dog + " -list") {
    dogPicDAO.getDogPics(dog, function (item) {
      var dogPics = item.dogPics;

      if (dogPics.length == 0) {
        noDogsMessage(message.channel, item.dogName);
        return;
      }

      var wrappedDogList = [];
      for (dog in dogPics) {
        wrappedDogList.push("<" + dogPics[dog] + ">")
      }
      message.channel.send(wrappedDogList);
    });
    return;
  }

  sendRandomDog(message.channel, dog);
}

/**
 * Sends a message to the given channel that there are no dog pics for the given dogName
 * 
 * @param {Object} channel - Channel to send the message to
 * @param {String} dogName - Name of the dog to use in the message
 */
function noDogsMessage(channel, dogName) {
  channel.send("Unfortunately there are no " + dogName + " pics to show currently :(\nA user with valid permissions can add pics with '!" + dogName + " -add <link to image>'")
}

/**
 * Sends a random picture from the pool of images for the given dog, to the given channel.
 * 
 * @param {Object} channel - The channel to send the dog pic
 * @param {String} dog - The dog whose pool of images to use
 */
function sendRandomDog(channel, dog) {
  dogPicDAO.getDogPics(dog, function (item) {
    var dogPics = item.dogPics;
    var dogPic = dogPics[Math.floor(Math.random() * dogPics.length)]
    channel.send({ file: dogPic });
  });
}

/**
 * Processes the case where a doc pic is to be added.
 * 
 * @param {String} message - The full command
 * @param {String} dog - The dog to use as a reference for the command
 */
function handleAddCase(message, dog) {
  if (!validAddRole(message.member)) {
    message.channel.send("Sorry, you do not have the right role to add dog pics.")
    return;
  }
  var commandIndex = dog.length + 6;
  var newPics = parsePics(message.content.substring(commandIndex), dog);

  dogPicDAO.addDogPics(dog, newPics, function (err) {
    var pictext = newPics.length > 1 ? 'pics' : 'pic';

    if (err) {
      message.channel.send('There was an error saving the new ' + pictext + '. Please contact @Reniat.');
    }
    else {
      message.channel.send("Added " + newPics.length + ' new ' + dog + ' ' + pictext + '!');
    }
  });
}

/**
 * Checks whether a given member has a valid role for adding dog pics.
 * 
 * @param {Object} member - The member to validate
 * @returns {boolean} true if the member has a valid role, false otherwise
 */
function validAddRole(member) {
  var dogCommandRoleID = "523526927844376577";
  return member.roles.has(dogCommandRoleID);
}

/**
 * Parses a string of comma seperated images and returns a list of the images.
 * 
 * @param {String} imagesString 
 * @returns {String[]} array of images contained in the gtiven string
 */
function parsePics(imagesString) {
  splitImages = imagesString.split(",");
  images = splitImages.length != 0 ? splitImages : imagesString;

  var newPics = [];
  for (image in images) {
    newPics.push(images[image].trim());
  }

  return newPics;
}

module.exports = DogCommand;