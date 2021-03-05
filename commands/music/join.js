const { Command } = require('discord.js-commando');

module.exports = class JoinCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'join',
      memberName: 'join',
      aliases: ['summon'],
      group: 'music',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      description:
        'Позволяет администратору вызывать бота на ваш голосовой канал во время воспроизведения музыки.'
    });
  }

  async run(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Я не телепат , присоеденись к каналу и попробуй снова');
      return;
    }
    if (message.guild.triviaData.isTriviaRunning == true) {
      message.reply('Попробуй снова как только викторина будет окончена');
      return;
    }
    if (message.guild.musicData.isPlaying != true) {
      message.reply('Сейчас ничего не играет');
      return;
    }
    try {
      await voiceChannel.join();
      return;
    } catch {
      message.reply(
        'Что то пошло не так'
      );
      return;
    }
  }
};
