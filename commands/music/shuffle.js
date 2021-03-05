const { Command } = require('discord.js-commando');
const Pagination = require('discord-paginationembed');

module.exports = class ShuffleQueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shuffle',
      memberName: 'shuffle',
      group: 'music',
      description: 'Перемешивает список воспроизведения',
      guildOnly: true
    });
  }
  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply(':no_entry: Присоеденись в голосовой канал и поробуй снова');
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
        `:no_entry: Ты должен быть в канале в котором нахожусь я `
      );
      return;
    } else if (message.guild.musicData.loopSong) {
      message.reply(
        ':x: Выключи команду **loop** а потом используй **shufle**'
      );
      return;
    }
    if (message.guild.musicData.queue.length < 1) {
      message.reply(':x: В очереди нет песен');
      return;
    }

    shuffleQueue(message.guild.musicData.queue);

    const queueClone = message.guild.musicData.queue;
    const queueEmbed = new Pagination.FieldsEmbed()
      .setArray(queueClone)
      .setAuthorizedUsers([message.author.id])
      .setChannel(message.channel)
      .setElementsPerPage(10)
      .formatField('# - Песня', function(e) {
        return `**${queueClone.indexOf(e) + 1}**: ${e.title}`;
      });

    queueEmbed.embed
      .setColor('#ff7373')
      .setTitle(':twisted_rightwards_arrows: Новая музыка в очереди');
    queueEmbed.build();
  }
};

function shuffleQueue(queue) {
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
}
