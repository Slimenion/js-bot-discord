const fs = require('fs');
const { Command } = require('discord.js-commando');

module.exports = class JojoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'goha',
      aliases: ['goha-gif', 'goha-gifs'],
      group: 'gifs',
      memberName: 'goha',
      description: 'Рандомная гифка от Гоши!',
      throttling: {
        usages: 2,
        duration: 8
      }
    });
  }

  run(message) {
    try {
      const linkArray = fs
        .readFileSync('././resources/gifs/gohalinks.txt', 'utf8')
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