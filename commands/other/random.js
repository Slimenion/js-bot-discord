const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'random',
      aliases: ['random-number', 'number-between', 'rng'],
      memberName: 'random',
      group: 'other',
      description: 'Генерирует случайное число между 2 заданными',
      args: [
        {
          key: 'min',
          prompt: 'Какое минимальное значение?',
          type: 'integer'
        },
        {
          key: 'max',
          prompt: 'Какое максимальное значение?',
          type: 'integer'
        }
      ]
    });
  }

  run(message, { min, max }) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var rngEmbed = new MessageEmbed().setTitle(
      Math.floor(Math.random() * (max - min + 1)) + min
    );
    message.channel.send(rngEmbed);
    return;
  }
};
