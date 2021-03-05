const { Command } = require('discord.js-commando');

module.exports = class PruneCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prune',
      aliases: ['delete-messages', 'bulk-delete', 'purge', 'clear'],
      description: 'Удаляет до 99 сообщений.',
      group: 'guild',
      memberName: 'prune',
      guildOnly: true,
      userPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
      args: [
        {
          key: 'deleteCount',
          prompt: 'Как много сообщений ты хочешь удалить?',
          type: 'integer',
          validate: deleteCount => deleteCount < 100 && deleteCount > 0
        }
      ]
    });
  }

  run(message, { deleteCount }) {
    message.channel
      .bulkDelete(deleteCount+1)
      .then(messages => console.log(`Deleted ${messages.size} messages of user ${message.author.username}`))
      .catch(e => {
        console.error(e);
        return message.reply(
          'Что-то пошло не так при удалении сообщений'
        );
      });
  }
};
