const { Command } = require('discord.js-commando');

module.exports = class RemoveSongCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove',
      memberName: 'remove',
      group: 'music',
      description: 'Удаляет отдельную песню из очереди',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt:
            ':wastebasket: Каков номер песни в очереди, который ты хочешь удалить?',
          type: 'integer'
        }
      ]
    });
  }
  run(message, { songNumber }) {
    if (songNumber < 1 || songNumber >= message.guild.musicData.queue.length) {
      message.reply(':x: Введи корректный номер песни');
      return;
    }
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Присоеденись к голосовому каналу и попробуй снова');
      return;
    }

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      message.reply(':x: Сейчас ничего не играет');
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `:no_entry: Ты должен находиться в том же голосовом канале ,что и бот`
      );
      return;
    }

    message.guild.musicData.queue.splice(songNumber - 1, 1);
    message.reply(
      `:wastebasket: Удалена песня номер ${songNumber} и очереди`
    );
  }
};
