const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: ['make-me-say', 'print'],
      memberName: 'say',
      group: 'other',
      description: 'Заставь бота сказать что-нибудь',
      args: [
        {
          key: 'text',
          prompt: ':microphone2: Что вы хотите чтобы бот сказал?',
          type: 'string'
        }
      ]
    });
  }

  run(message, { text }) {
    var embed = new MessageEmbed()
      .setTitle(`Меня попросили передать всем , что...`)
      .setColor('#888888')
      .setDescription(text)
      .setTimestamp()
      .setFooter(
        `${message.member.displayName}, сказал мне это сделать`,
        message.author.displayAvatarURL()
      );
    message.channel.send(embed);
    return;
  }
};
