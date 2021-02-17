const { Command } = require('discord.js-commando');
const fs = require('fs')
module.exports = class AccountCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'account',
            group: 'tournament',
            memberName: 'account',
            description: 'Fetches your linked MTGA account',
        });
    }
    run(message) {
        let accounts = fs.readFileSync('accounts.txt')
        accounts = JSON.parse(accounts)
        message.say("Your linked mtga account: " + accounts[message.author.id].mtgname)
    }
};