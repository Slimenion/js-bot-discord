const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      aliases: ['ban-member', 'ban-hammer'],
      memberName: 'ban',
      group: 'guild',
      description: 'Баинит провенившегося пользователя.',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
      clientPermissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
      args: [
        {
          key: 'userToBan',
          prompt:
            'Только скажи кто, и его настигнет божья кара',
          type: 'string'
        },
        {
          key: 'reason',
          prompt: 'Что сделал жалкий смертный?',
          type: 'string'
        },
        {
          key: 'daysDelete',
          prompt:
            'Сообщения за сколько дней вы хотите удалить от этого пользователя?',
          type: 'integer',
          validate: function validate(daysDelete) {
            return daysDelete < 8 && daysDelete > 0;
          }
        }
      ]
    });
  }

  async run(message, { userToBan, reason, daysDelete }) {
    const extractNumber = /\d+/g;
    const userToBanID = userToBan.match(extractNumber)[0];
    const user =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(userToBanID));
    if (user == undefined)
      return message.channel.send('Гнев слепит, попробуй написать верного пользователя');
    user
      .ban({ days: daysDelete, reason: reason })
      .then(() => {
        const banEmbed = new MessageEmbed()
          .addField('Banned:', userToBan)
          .addField('Reason', reason)
          .setColor('#420626');
        message.channel.send(banEmbed);
      })
      .catch(err => {
        message.reply(
          'О боже! Что-то пошло не так , возможно ты не даешь мне привелегии сделать последний удар'
        );
        return console.error(err);
      });
  }
};
