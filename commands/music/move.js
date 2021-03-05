const { Command } = require('discord.js-commando');

module.exports = class MoveSongCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'move',
      memberName: 'move',
      aliases: ['m', 'movesong'],
      description: 'Перемещает песню на укаанную позицию',
      group: 'music',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'oldPosition',
          type: 'integer',
          prompt: 'Какую песню из списка ты хочешь передвинуть (нужен номер позиции)?'
        },
        {
          key: 'newPosition',
          type: 'integer',
          prompt: 'На какую позицию ты хочешь предвинуть?'
        }
      ]
    });
  }
  async run(message, { oldPosition, newPosition }) {
    if (
      oldPosition < 1 ||
      oldPosition > message.guild.musicData.queue.length ||
      newPosition < 1 ||
      newPosition > message.guild.musicData.queue.length ||
      oldPosition == newPosition
    ) {
      message.reply('Попробуй снова с корректным номером очереди');
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
      message.reply('Ты что меня не слушаешь? Сейчас ничего не играет');
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `Присоеденись к комнате со мной и попробуй снова`
      );
      return;
    } else if (message.guild.musicData.loopSong) {
      message.reply(
        'Выключи **loop** перед использованием **move**'
      );
      return;
    }

    const songName = message.guild.musicData.queue[oldPosition - 1].title;

    MoveSongCommand.array_move(
      message.guild.musicData.queue,
      oldPosition - 1,
      newPosition - 1
    );

    message.channel.send(`**${songName}** передвинута на позицию ${newPosition}`);
  }
  static array_move(arr, old_index, new_index) {
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }
};
