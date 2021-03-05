const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class NicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nickname',
      aliases: ['set-nick', 'set-nickname'],
      group: 'guild',
      memberName: 'nickname',
      description:
        "Ставит никнейм который видно на сервере",
      clientPermissions: ['MANAGE_NICKNAMES'],
      userPermissions: ['MANAGE_NICKNAMES'],
      guildOnly: true,
      args: [
        {
          key: 'memberName',
          prompt: 'У какого участника вы желаете поменять никнейм?',
          type: `member`,
          error: 'Такого польователя не существует.'
        },
        {
          key: 'nickname',
          prompt: 'На какой никнейм вы хотите поменять текущий?',
          type: 'string'
        }
      ]
    });
  }

  async run(message, { memberName, nickname }) {
    if (nickname === 'remove') {
      try {
        await memberName.setNickname('');
      } catch {
        message.reply(
          `Не могу поменять никнейм , ты подымаешь руку на старшего`
        );
        return;
      }
      try {
        const nickRemoved = new MessageEmbed();
        nickRemoved
          .setColor('RANDOM')
          .setTitle('Nickname Cleared!')
          .addField('Member', `${memberName.user.username}`)
          .addField('Moderator', `${message.author}`)
          .setThumbnail(memberName.user.displayAvatarURL({ dynamic: true }))
          .setFooter('Cleared', message.author.displayAvatarURL())
          .setTimestamp();
        message.channel.send(nickRemoved);
        return;
      } catch {
        message.reply('Что-то пошло не так');
        return;
      }
    } else {
      const oldName = memberName.displayName;
      try {
        await memberName.setNickname(nickname);
      } catch {
        message.reply(
          `Не могу поменять никнейм , ты подымаешь руку на старшего`
        );
        return;
      }
      try {
        const nickChanged = new MessageEmbed();
        nickChanged
          .setColor('RANDOM')
          .setTitle('Nickname Changed!')
          .addField('Member', `${memberName.user.username}`)
          .addField('Old Name', `${oldName}`)
          .addField('New Name', `${nickname}`)
          .addField('Moderator', `${message.author}`)
          .setThumbnail(memberName.user.displayAvatarURL({ dynamic: true }))
          .setFooter('Changed', message.author.displayAvatarURL())
          .setTimestamp();
        message.channel.send(nickChanged);
        return;
      } catch {
        message.reply('Что-то пошло не так');
        return;
      }
    }
  }
};
