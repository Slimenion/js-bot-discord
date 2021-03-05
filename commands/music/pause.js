const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause',
      aliases: ['pause-song', 'hold'],
      memberName: 'pause',
      group: 'music',
      description: 'Останнавливает текущую песню',
      guildOnly: true
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Я не телепат, зайди в канал и попробуй снова');
      return;
    }

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      message.reply('Ты что меня не слушаешь? Сейчас ничего не играет');
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `Зайди в канал там где я нахожусь, и попробуй снова`
      );
      return;
    }

    message.reply(
      'Песня остановленна , чтобы продолжить введи команду **resume**'
    );

    message.guild.musicData.songDispatcher.pause();
  }
};
