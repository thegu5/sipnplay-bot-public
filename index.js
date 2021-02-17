const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');
const { Message } = require('discord.js');
const client = new CommandoClient({
	commandPrefix: 's!',
	owner: ['690670278514180157', '639966783213928448'],
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['tournament', 'commands with the challonge api'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with the Challonge API || s!help');
});

client.on('message', async message => {
	
	
})
client.on('error', console.error);
client.login(config.token)