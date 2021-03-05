// const fetch = require("node-fetch");
// const { tenorAPI } = require("../config.json");
const fs = require('fs');
const { Command } = require('discord.js-commando');

module.exports = class JojoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'jojo',
      aliases: ['jojo-gif', 'jojo-gifs'],
      group: 'gifs',
      memberName: 'jojo',
      description: 'Рандомная jojo gif!',
      throttling: {
        usages: 2,
        duration: 8
      }
    });
  }

  run(message) {
    try {
      const linkArray = fs
        .readFileSync('././resources/gifs/jojolinks.txt', 'utf8')
        .split('\n');
      const link = linkArray[Math.floor(Math.random() * linkArray.length)];
      message.channel.send(link);
      return;
    } catch (e) {
      message.reply('Ошибка при попытке поиска gif!');
      return console.error(e);
    }
  }
};
