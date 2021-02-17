const { Command } = require('discord.js-commando');
const fs = require('fs')
const Discord = require('discord.js')
const mtgRegexp = /(.*#\d\d\d\d\d)/
module.exports = class LinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'link',
            group: 'tournament',
            memberName: 'link',
            description: 'Links your discord account with your mtga account',
            args: [
                {
                    key: 'mtganame',
                    prompt: 'What mtga account are you linking?',
                    type: 'string',
                },
            ],
        });
    }
    run(message, { mtganame }) {
        if (!mtgRegexp.test(mtganame)) {
            return message.say(`${mtganame} isn't a valid MTGA username! Make sure it is in the correct format. Example: username#12345`)
        }
        let accounts = fs.readFileSync('accounts.txt')
        accounts = JSON.parse(accounts)
        accounts[message.author.id] = {}
        accounts[message.author.id].mtgname = mtganame
        fs.writeFileSync('./accounts.txt', JSON.stringify(accounts))
        const embed = new Discord.MessageEmbed()
            .setTitle('Account Linked')
            .setColor('#00ff00')
            .setDescription(`${mtganame} has been linked to ${message.author.tag}`)
        message.say(embed)
    }
};