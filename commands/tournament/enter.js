const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const fs = require('fs')
const config = require('../../config.json');
const Discord = require('discord.js')
module.exports = class EnterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'enter',
            group: 'tournament',
            memberName: 'enter',
            description: 'enter a tournament',
            args: [
                {
                    key: 'tId',
                    prompt: 'Which tournament would you like to join?',
                    type: 'string',
                }
            ]
        });
    }
    async run(message, { tId }) {
        let accounts = fs.readFileSync('accounts.txt')
        accounts = JSON.parse(accounts)
        const matches = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${tId}/matches.json`)
            .then(res => res.json())
            .then(json => { return json })
        console.log(Array.isArray(matches))
        const matchObj = matches[0]
        if (matchObj) {
            return message.say('That tournament has already started!');
        };
        if (!accounts[message.author.id].mtgname) {
            message.say('You don\'t have a linked MTGA account! Make sure to link it with s!link')
        }
        const body = {
            participant: {

                name: accounts[message.author.id].mtgname

            }
        };
        let linkedAcc = accounts[message.author.id].mtgname
        linkedAcc = encodeURIComponent(linkedAcc)
        try {
            const result = fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${tId}/participants.json?participant[name]=${linkedAcc}`, {
                method: 'post',
                body: JSON.stringify(body),
            })
                .then(res => { console.log(res); return res.json() })
                .then(json => console.log(json));
            if (result.errors) {
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
                .setDescription(`${accounts[message.author.id].mtgname} has been added to Challonge id ${tId}`)
                .setTimestamp()
            message.say(embed)
        }
        catch (err) {
            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error')
                .addFields(
                    { name: 'Error:', value: err }
                )
                .setTimestamp()
            message.say(embed)
        }
    }
};