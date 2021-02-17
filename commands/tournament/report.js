const { Command } = require('discord.js-commando');
const fs = require('fs')
const fetch = require('node-fetch')
const config = require('../../config.json')
const Discord = require('discord.js')
const accounts = JSON.parse(fs.readFileSync('accounts.txt'))
module.exports = class AccountCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'report',
            group: 'tournament',
            memberName: 'report',
            description: 'Reports a score to the bracket',
            args: [
                {
                    key: 't_id',
                    prompt: 'What tournament are you reporting a score to?',
                    type: 'string'
                },
                {
                    key: 'match_id',
                    prompt: 'What is the match ID?',
                    type: 'integer'
                },
                {
                    key: 'player1_points',
                    prompt: 'How many points did player 1 get in your matchup (first player listed on the match command)?',
                    type: 'integer'
                },
                {
                    key: 'player2_points',
                    prompt: 'How many points did player 2 get in your matchup (second player listed on the match command)?',
                    type: 'integer'
                }
            ]
        });
    }
    async run(message, { t_id, player1_points, player2_points, match_id}) {
        let matches = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${t_id}/matches/${match_id}.json`)
            .then(res => res.json())
        console.log(matches)
        if (matches.errors) {
            let errorlist = toString(matches.errors)
            errorlist = errorlist.replace('[', '')
            errorlist = errorlist.replace(']', '')
            errorlist = errorlist.replace("'", '')
            let embed = new Discord.MessageEmbed()
                .setTitle('Error')
                .setColor('#ff0000')
                .setDescription(errorlist)
            return message.say(embed)
        }
        if (!matches && !matches.match.id) {
            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error')
                .addFields(
                    { name: 'Failed to report score', value: 'That tournament has not started yet.'}
                )
                .setTimestamp()
            return message.say(embed)
        }
        let player1_id = matches.match.player1_id
        let player2_id = matches.match.player2_id
        let scores_csv = `${player1_points}-${player2_points}`
        let winner = 0
        if (player1_points > player2_points) {
            winner = player1_id
        } else {
            winner = player2_id
        }
        const reportRes = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${t_id}/matches/${match_id}.json?match[scores_csv]=${scores_csv}&match[winner_id]=${winner}`, {
            method: 'put'
        })
            .then(res => res.json())
        console.log(reportRes)
        if (reportRes.match.winner_id && reportRes.match.loser_id) {
            const embed = new Discord.MessageEmbed()
                .setColor('#00ff00')
                .setTitle('Success')
                .addFields(
                    { name: 'Match report has been submitted.', value: `Player id ${winner} won, with scores ${scores_csv}`}
                )
                .setTimestamp()
            if (matches[matches.length - 1] = match_id) {
                const participants = fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${t_id}/participants.json`)
                let tournamentWinner
                for (let i = 0; i < participants.length; i++) {
                    if (participants[i].participant.id == winner) {
                        tournamentWinner = participants[i].participant.name
                    }
                }
                let tournamentWinnerDisc
                for (const key in accounts) {
                    if (accounts.key.mtgname == tournamentWinner) {
                        tournamentWinnerDisc = key
                    }
                }
                const embed2 = new Discord.MessageEmbed()
                    .setColor('#ffd700')
                    .setTitle('We have a winner!')
                    .setDescription(`Congrats to <@${tournamentWinnerDisc}> (${tournamentWinner}) for winning the tournament!`)
                    .setFooter(`The sipnplay staff account can use s!finalize ${t_id} to finalize the tournament`)
                    message.say(embed2)
            }
            return message.say(embed)
        }
        /*
        let accounts = fs.readFileSync('accounts.txt')
        accounts = JSON.parse(accounts);
        let a = 0;
        const participants = await fetch(`https://thegu5:${config.chAPi}@api.challonge.com/v1/tournaments/${t_id}/participants.json`)
        console.log(participants)
        var author_id = 0
        for (a; a < participants.length; a++) {
            if (accounts[message.author.id].mtgname == participants[i].participant.name) {
                author_id = participants[i].participant.id
                console.log(author_id)
            }
        }
        const matches = await fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${t_id}/matches.json?state=open&participant_id=${author_id}`)
            .then(res => res.json())
            .then(json => {return json;})
        console.log(matches)
        let oppo_id = 0
        let author_playernum = 0
        if (matches[0].match.player1_id == author_id) {
            author_playernum = 1
            oppo_id = matches[0].match.player2_id
        } else {
            author_playernum = 2
            oppo_id = matches[0].match.player1_id
        }
        let b = 0;
        let oppo_mtgname = ''
        for (b; b < participants.length; b++) {
            if (participants[i].participant.id == oppo_id) {
                oppo_mtgname = participants[i].participant.name
            }
        }
        let oppo_discord_id = 0
        for (let [key, value] of Object.entries(accounts)) {
            if (value.mtgname == oppo_mtgname) {
                oppo_discord_id = key
            }
        }
        let scores_csv = ''
        if (author_playernum = 1) {
            scores_csv = `${author_points}-${oppo_points}`
        } else {
            scores_csv = `${oppo-points}-${author_points}`
        }
        let winner_id = 0
        if (author_points > oppo_points) {
            winner_id = author_id
        } else {
            winner_id = oppo_id
        }
        const reportRes = fetch(`https://thegu5:${config.chApi}@api.challonge.com/v1/tournaments/${t_id}/matches/${matches[0].match.id}.json?_method=PUT&match[scores_csv]=${scores_csv}&match[winner_id]=${winner_id}`)
        message.say(`<@${message.author.id}> vs <@${oppo_discord_id}>: ${author_points}-${oppo_points} on ${t_id}`)
        */
    }
};