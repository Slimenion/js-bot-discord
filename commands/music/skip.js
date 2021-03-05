const { Command } = require('discord.js-commando');
const { prefix } = require('../../config.json');

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['skip-song', 'advance-song', 'next'],
      memberName: 'skip',
      group: 'music',
      description: 'Пропуск определенной песни',
      guildOnly: true
    });
  }

  run(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply(':no_entry: Я не телепат. Присоеденись в канал и попробуй снова');
      return;
    }

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      message.reply('Ты что меня не слушаешь ? Сейчас ничего не играет');
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `:no_entry: Ты должен быть в том же канале что и я`
      );
      return;
    } else if (message.guild.triviaData.isTriviaRunning) {
      message.reply(`Ты не можешь пропустить викторину. Используй для этого  ${prefix}end-trivia`);
      return;
    }
    message.guild.musicData.loopSong = false;
    message.guild.musicData.songDispatcher.end();
  }
};
