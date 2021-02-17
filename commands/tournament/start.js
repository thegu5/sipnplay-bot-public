const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const config = require('../../config.json')
module.exports = class StartCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'start',
            group: 'tournament',
            memberName: 'start',
            description: 'Start a tournament',
            args: [
                {
                    key: 't_id',
                    type: 'string',
                    prompt: 'What tournament do you want to start?'
                }
            ],
            ownerOnly: true
        });
    }
    run(message, { t_id }) {
        const res = fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${t_id}/start.json`, { method: 'post' })
            .then(raw => raw.json())
        if (res.errors) {
            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error')
                .addFields(
                    { name: 'Error:', value: err }
                )
                .setTimestamp()
            return message.say(embed)
        }
        const embed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .setTitle('Success')
            .setDescription(`Tournament ${t_id} has been started successfully`)
            .setTimestamp()
        return message.say(embed)
    }
};