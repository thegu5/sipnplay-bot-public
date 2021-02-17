const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const config = require('../../config.json')
module.exports = class MatchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'matches',
            group: 'tournament',
            memberName: 'matches',
            description: 'Fetches the current matches that need to be completed for a specified challonge tournament',
            args: [
                {
                    key: 'id',
                    prompt: 'What challonge tournament do you want to fetch',
                    type: 'string',
                },
            ],
        });
    }
    async run(message, { id }) {
        const matches = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${id}/matches.json`)
            .then(res => res.json())
            .then(json => {return json;})
        let i = 0
        for (i; i < matches.length; i++) {
            if (matches[i].match.player1_id == null && matches[i].match.player2_id !== null) {
                let player2 = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${id}/participants/${matches[i].match.player2_id}.json`)
                    .then(res => res.json())
                    .then(json => {return json;})
                message.say(`Match \`${matches[i].match.id}\`: \`Undetermined\` vs ${player2.participant.name} (\`${matches[i].match.player2_id}\`)`)
            } else if (matches[i].match.player2_id == null && matches[i].match.player1_id !== null) {
                let player1 = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${id}/participants/${matches[i].match.player1_id}.json`)
                    .then(res => res.json())
                    .then(json => {return json;})
                message.say(`Match \`${matches[i].match.id}\`: ${player1.participant.name} (\`${matches[i].match.player1_id}\`) vs \`Undetermined\``)
            } else if (matches[i].match.player1_id == null && matches[i].match.player2_id == null) {

            } else if (!matches[i].match.state == 'open') {

            } else {
                let player1 = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${id}/participants/${matches[i].match.player1_id}.json`)
                    .then(res => res.json())
                    .then(json => {return json;})
                let player2 = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${id}/participants/${matches[i].match.player2_id}.json`)
                    .then(res => res.json())
                    .then(json => {return json;})
                message.say(`Match \`${matches[i].match.id}\`: ${player1.participant.name} (\`${matches[i].match.player1_id}\`) vs ${player2.participant.name} (\`${matches[i].match.player2_id}\`)`)
            }
        }
    }
};