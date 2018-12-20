const DogPicDAO = require('./DogPicDAO');
const dogPicDAO = new DogPicDAO();

class DogCommand {
    constructor(dog) {
        this.dog = dog;
    }

    processMessage(message) {
        handleDogCommand(message, this.dog);
    }
}

function handleDogCommand(message, dog) {

    var content = message.content;

    var flag = content.split(" ")[1];

    // who has time for an actual grammar?
    if (flag && flag.trim().toLowerCase() === "-add") {
        handleAddCase(message, dog);
        return;
    }

    if (content === "!" + dog + " -list") {
        dogPicDAO.getDogPics(dog, function(item) {
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

function noDogsMessage(channel, dogName) {
    channel.send("Unfortunately there are no " + dogName + " pics to show currently :(\nA user with valid permissions can add pics with '!" + dogName + " -add <link to image>'")
}

function sendRandomDog(channel, dog) {
    dogPicDAO.getDogPics(dog, function(item) {
        var dogPics = item.dogPics;
        var dogPic = dogPics[Math.floor(Math.random()*dogPics.length)]
        channel.send({file: dogPic});
    });
}

function handleAddCase(message, dog) {
    if (!validAddRole(message.member)) {
        message.channel.send("Sorry, you do not have the right role to add dog pics.")
        return;
    }
    var commandIndex = dog.length + 6;
    var newPics = parsePics(message.content.substring(commandIndex), dog);
    
    dogPicDAO.addDogPics(dog, newPics, function(err) {
        var pictext = newPics.length > 1 ? 'pics' : 'pic';

        if (err) {
            message.channel.send('There was an error saving the new ' + pictext + '. Please contact @Reniat.');
        }
        else {
            message.channel.send("Added " + newPics.length + ' new ' + dog + ' ' + pictext + '!');
        }
    });
}

function validAddRole(member) {
    var dogCommandRoleID = "523526927844376577";
    return member.roles.has(dogCommandRoleID);
}

function parsePics(imagesString, dog) {
    splitImages = imagesString.split(",");
    images = splitImages.length != 0 ? splitImages : imagesString;

    var newPics = [];
    for (image in images) {
        newPics.push(images[image].trim());
    }

    return newPics;
}

module.exports = DogCommand;