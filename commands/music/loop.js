const { Command } = require('discord.js-commando');

module.exports = class LoopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'loop',
      aliases: [`repeat`],
      group: 'music',
      memberName: 'loop',
      guildOnly: true,
      description: 'Зацикливает песню которая сейчас играет'
    });
  }

  run(message) {
    if (!message.guild.musicData.isPlaying) {
      message.reply('Ты что меня не слушаешь? Сейчас ничего не играет');
      return;
    } else if (
      message.guild.musicData.isPlaying &&
      message.guild.triviaData.isTriviaRunning
    ) {
      message.reply('Ты не можешь зациклить викторину!');
      return;
    } else if (
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    ) {
      message.reply(
        `Присоеденись к комнате со мной и попробуй снова`
      );
      return;
    }

    if (message.guild.musicData.loopSong) {
      message.guild.musicData.loopSong = false;
      message.channel.send(
        `**${message.guild.musicData.nowPlaying.title}** больше не играет на повторе`
      );
    } else {
      message.guild.musicData.loopSong = true;
      message.channel.send(
        `**${message.guild.musicData.nowPlaying.title}** теперь играет на повторе `
      );
    }
  }
};
