const { Command } = require('discord.js-commando');
const Pagination = require('discord-paginationembed');

module.exports = class QueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      aliases: ['song-list', 'next-songs', 'q'],
      group: 'music',
      memberName: 'queue',
      guildOnly: true,
      description: 'Показывает очередь песен'
    });
  }

  run(message) {
    if (message.guild.triviaData.isTriviaRunning) {
      message.reply(':x: Попрбуй снова после конца викторины');
      return;ё
    }
    if (message.guild.musicData.queue.length == 0) {
      message.reply(':x: Нет песен в очереди');
      return;
    }
    const queueClone = message.guild.musicData.queue;
    const queueEmbed = new Pagination.FieldsEmbed()
      .setArray(queueClone)
      .setAuthorizedUsers([message.author.id])
      .setChannel(message.channel)
      .setElementsPerPage(8)
      .formatField('# - Песня', function(e) {
        return `**${queueClone.indexOf(e) + 1}**: [${e.title}](${e.url})`;
      });

    queueEmbed.embed.setColor('#ff7373').setTitle('Список песен');
    queueEmbed.build();
  }
};
