const { Command } = require('discord.js-commando');

module.exports = class SkipToCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipto',
      memberName: 'skipto',
      group: 'music',
      description:
        'Скипнуть до определенного номера номера песни в списке воспроизведения, это явно больше 1',
      guildOnly: true,
      args: [
        {
          key: 'songNumber',
          prompt:
            'До какого номера песни мне скипать? И я надеюсь что мы уже уяснили что это больше 1',
          type: 'integer'
        }
      ]
    });
  }

  run(message, { songNumber }) {
    if (songNumber < 1 && songNumber >= message.guild.musicData.queue.length) {
      message.reply(':x: -_- введи правильный номер');
      return;
    }
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply(':no_entry: Я не телепат. Присоеденись в канал и попробуй снова');
      return;
    }

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      message.reply(':x: Ты что меня не слушаешь ? Сейчас ничего не играет');
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `:no_entry: Ты должен быть в том же канале что и я`
      );
      return;
    }

    if (message.guild.musicData.queue < 1) {
      message.reply(':x: Ты что меня не слушаешь ? Сейчас ничего не играет');
      return;
    }

    if (!message.guild.musicData.loopQueue) {
      message.guild.musicData.queue.splice(0, songNumber - 1);
      message.guild.musicData.loopSong = false;
      message.guild.musicData.songDispatcher.end();
    } else if (message.guild.musicData.loopQueue) {
      const slicedBefore = message.guild.musicData.queue.slice(
        0,
        songNumber - 1
      );
      const slicedAfter = message.guild.musicData.queue.slice(songNumber - 1);
      message.guild.musicData.queue = slicedAfter.concat(slicedBefore);
      message.guild.musicData.songDispatcher.end();
    }
  }
};
