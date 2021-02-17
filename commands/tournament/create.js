const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const config = require('../../config.json');
const Discord = require('discord.js')
module.exports = class CreateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'create',
            group: 'tournament',
            memberName: 'create',
            description: 'Creates an mtg tournament (Owner Only)',
            ownerOnly: true,
            args: [
                {
                    key: 'name',
                    prompt: 'What is the tournament\'s name?',
                    type: 'string',
                }
            ]
        });
    }
    async run(message, { name }) {
        const body = {
            tournament: {
                name: name
            }
        }
        function makeid(length) {
            var result           = '';
            var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }
         
        const url = makeid(8);
        const result = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments.json?tournament[name]=${name}&tournament[tournament_type]=double%20elimination&tournament[url]=${url}`, {
                method: 'post',
                body: JSON.stringify(body),
        }).then(res => {return res.json()})
        const embed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .setTitle('Success')
            .setDescription('Tournament successfuly created!')
            .addFields([
                { name: 'Link:', value: result.tournament.full_challonge_url},
            ])
        message.say(embed)
    }
};