const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      aliases: ['kick-member', 'throw'],
      memberName: 'kick',
      group: 'guild',
      description: 'Кикает выбранного участника.',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
      clientPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
      args: [
        {
          key: 'userToKick',
          prompt:
            'Только скажи кто, и его настигнет божья кара.',
          type: 'string'
        },
        {
          key: 'reason',
          prompt: 'Что сделал жалкий смертный?',
          type: 'string'
        }
      ]
    });
  }

  async run(message, { userToKick, reason }) {
    const extractNumber = /\d+/g;
    const userToKickID = userToKick.match(extractNumber)[0];
    const user =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(userToKickID));
    if (user == undefined)
      return message.channel.send('Гнев слепит, попробуй написать верного пользователя');
    user
      .kick(reason)
      .then(() => {
        const kickEmbed = new MessageEmbed()
          .addField('Kicked:', userToKick)
          .addField('Reason:', reason)
          .setColor('#420626');
        message.channel.send(kickEmbed);
      })
      .catch(err => {
        message.reply(
          'О боже! Что-то пошло не так , возможно ты не даешь мне привелегии сделать удар'
        );
        return console.error(err);
      });
  }
};
