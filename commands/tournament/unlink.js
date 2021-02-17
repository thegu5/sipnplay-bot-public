const { Command } = require('discord.js-commando');
const fs = require('fs')
const Discord = require('discord.js')
module.exports = class UnlinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unlink',
            group: 'tournament',
            memberName: 'unlink',
            description: 'Unlinks your discord account with your mtga account',
        });
    }
    run(message) {
        let accounts = fs.readFileSync('accounts.txt')
        accounts = JSON.parse(accounts)
        const mtganame = accounts[message.author.id].mtgname
        accounts[message.author.id].mtgname = ""
        fs.writeFileSync('./accounts.txt', JSON.stringify(accounts))
        const embed = new Discord.MessageEmbed()
            .setTitle('Account Unlinked')
            .setColor('#ff0000')
            .setDescription(`${mtganame} has been unlinked from ${message.author.tag}`)
        message.say(embed)
    }
};