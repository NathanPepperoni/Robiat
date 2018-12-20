const fs = require("fs");
const Logger = require('./Logger');
const logger = new Logger();

function handleDogCommand(message, dog) {

    var content = message.content;

    var flag = content.split(" ")[1];

    var dogList = loadDogPics(dog);

    // who has time for an actual grammar?
    if (flag && flag.trim().toLowerCase() === "-add") {
        handleAddCase(message, dog);
        return;
    }

    if (content === "!" + dog + " -list") {
        var wrappedDogList = [];
        for (dog in dogList) {
            wrappedDogList.push("<" + dogList[dog] + ">")
        }
        message.channel.send(wrappedDogList);

        return;
    }

    if (dogList.length == 0) {
        message.channel.send("Unfortunately there are no " + dog + " to show currently :(\nA user with valid permissions can add pics with '!" + dog + " -add <link to image>'")
        return;
    }
    var dogPic = dogList[Math.floor(Math.random()*dogList.length)]
    message.channel.send({file: dogPic});
}

function loadDogPics(dog) {
    var dogData = fs.readFileSync(dog + 'Pics.dog').toString();
    if (dogData.length == 0) {
        return [];
    }

    var splitData = dogData.split(',');

    for (data in splitData) {
        splitData[data] = splitData[data].trim();
    }

    return splitData.length > 0 ? splitData : [dogData];
}

function handleAddCase(message, dog) {
    if (!validAddRole(message.member)) {
        message.channel.send("sorry, you do not have the right role to add dog pics.")
        return;
    }
    var commandIndex = dog.length + 6;
    var newPics = parsePics(message.channel, message.content.substring(commandIndex), dog);
    
    message.channel.send(updateDogPics(dog, newPics));
}

function validAddRole(member) {
    var dogCommandRoleID = "523526927844376577";
    return member.roles.has(dogCommandRoleID);
}

function parsePics(channel, imagesString, dog) {
    splitImages = imagesString.split(",");
    images = splitImages.length != 0 ? splitImages : imagesString;

    var newPics = [];
    for (image in images) {
        newPics.push(images[image].trim());
    }

    return newPics;
}

function updateDogPics(dog, newPics) {
    var dogPics = loadDogPics(dog);
    dogPics = dogPics.length > 0 ? dogPics.concat(newPics) : newPics;
    fs.writeFile(dog + 'Pics.dog', dogPics, 'utf8', function (err) {
        logger.logEvent('error', err);
    });

    var end = dogPics.length > 1 ? ' pics!' : ' pic!';
    return "added " + newPics.length + ' new ' + dog + end;
}

class DogCommand {
    constructor(dog) {
        this.dog = dog;
        this.dogPics = loadDogPics(dog);
    }

    processMessage(message) {
        handleDogCommand(message, this.dog, this.dogPics);
    }
}

module.exports = DogCommand;