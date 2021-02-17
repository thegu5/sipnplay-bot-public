# sipnplay-bot
A discord bot integrated with the challonge api to make tournament organizing easier

## Installation

Download [Nodejs](https://nodejs.org)

While it's installing...

Clone this repository
Create a file in the base directory called `accounts.txt` and write this inside it:

`{}`

Create a file called `config.json` in the base directory with this data in it (replace all-caps words with their correct values):
```
{
    "chApi":"CHALLONGE API KEY",
    "token":"BOT TOKEN"
}
```

When Nodejs has finished installing, open a command prompt in the code's directory.
<img src="https://i.imgur.com/xy3TLxw.gifv">

Run the following:
`npm i discord.js discord.js-commando node-fetch`

## Bringing the bot online

Just run `node .` in the correct directory!