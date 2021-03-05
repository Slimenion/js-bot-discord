const { Command } = require('discord.js-commando');

module.exports = class LoopQueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'loopqueue',
      memberName: 'loopqueue',
      aliases: ['loop-queue', 'queue-loop'],
      group: 'music',
      description: 'Зациклить очередь n раз (если не указать значения зациклиться 1 раз)',
      guildOnly: true,
      args: [
        {
          key: 'numOfTimesToLoop',
          default: 1,
          type: 'integer',
          prompt: 'Как много раз ты хочешь зациклить очередь?'
        }
      ]
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
      message.reply('Ты не можешь зациклить викторину');
      return;
    } else if (
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    ) {
      message.reply(
        `Присоеденись к комнате со мной и попробуй снова`
      );
      return;
    } else if (message.guild.musicData.queue.length == 0) {
      message.reply(`Я не могу зациклить пустую очередь`);
      return;
    } else if (message.guild.musicData.loopSong) {
      message.reply(
        'Выключи **loop** прежде чем использовать **loopqueue**'
      );
      return;
    }

    if (message.guild.musicData.loopQueue) {
      message.guild.musicData.loopQueue = false;
      message.channel.send(
        'Эта очередь больше не зациклена'
      );
    } else {
      message.guild.musicData.loopQueue = true;
      message.channel.send('Очередь теперь зациклина');
    }
  }
};
