const { Command } = require('discord.js-commando');

module.exports = class SkipAllCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipall',
      aliases: ['skip-all'],
      memberName: 'skipall',
      group: 'music',
      description: 'Скипнуть все песни в очереди',
      guildOnly: true
    });
  }

  run(message) {
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
    if (!message.guild.musicData.queue) {
      message.reply(':x: Ты что меня не слушаешь ? Сейчас ничего не играет');
      return;
    }
    message.guild.musicData.queue.length = 0; // clear queue
    message.guild.musicData.loopSong = false;
    message.guild.musicData.loopQueue = false;
    message.guild.musicData.songDispatcher.end();
    return;
  }
};
