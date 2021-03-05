const { Command } = require('discord.js-commando');

module.exports = class LeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: ['end', 'stop'],
      group: 'music',
      memberName: 'leave',
      guildOnly: true,
      description: 'Бот покидает голосовой канал'
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Я не телепат , присоеденись к каналу и попробуй снова');
      return;
    } else if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      if (
        message.guild.musicData.isPlaying == false &&
        message.guild.me.voice.channel
      ) {
        message.guild.me.voice.channel.leave();
      } else {
        message.reply('Ты что меня не слушаешь? Сейчас ничего не играет');
      }
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `Ты сначала в комнату зайди , а потом посмотрим кто-кого кикнет!`
      );
      return;
    } else if (message.guild.triviaData.isTriviaRunning) {
      message.reply(
        `Используй stop-trivia`
      );
    } else if (!message.guild.musicData.queue) {
      message.reply('Ты что меня не слушаешь? Сейчас ничего не играет');
      return;
    } else if (message.guild.musicData.songDispatcher.paused) {
      message.guild.musicData.songDispatcher.resume();
      message.guild.musicData.queue.length = 0;
      message.guild.musicData.loopSong = false;
      message.guild.musicData.skipTimer = true;
      setTimeout(() => {
        message.guild.musicData.songDispatcher.end();
      }, 100);
      message.reply(
        `выгоняет меня , надеюсь у него есть веская на то причина`
      );
      return;
    } else {
      message.guild.musicData.queue.length = 0;
      message.guild.musicData.skipTimer = true;
      message.guild.musicData.loopSong = false;
      message.guild.musicData.loopQueue = false;
      message.guild.musicData.songDispatcher.end();
      message.reply(
        `выгоняет меня , надеюсь у него есть веская на то причина`
      );
      return;
    }
  }
};
