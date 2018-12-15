class RoyalPetWatcher {
    constructor() { }

    static processMessage(message) {
        console.log(message.content);
    }
}
module.exports = RoyalPetWatcher;