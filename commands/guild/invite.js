const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { invite } = require('../../config.json');

// Only if invite is in config.json and set to true
if (!invite) return;

module.exports = class InviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      group: 'guild',
      memberName: 'invite',
      description: 'Отправляет ссылку с приглашением бота на чей-либо сервер.'
    });
  }

  async run(message) {
    //provides the link with admin permissions
    const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot`;

    const guildCacheMap = this.client.guilds.cache;
    const guildCacheArray = Array.from(guildCacheMap, ([name, value]) => ({
      name,
      value
    }));
    let memberCount = 0;
    for (let i = 0; i < guildCacheArray.length; i++) {
      memberCount = memberCount + guildCacheArray[i].value.memberCount;
    }

    const embed = new MessageEmbed()
      .setTitle(this.client.user.username + ': ссылка приглашение')
      .setColor('RANDOM')
      .setURL(inviteURL)
      .setThumbnail(this.client.user.displayAvatarURL())
      .setDescription(
        `**В данный момент**
        Работаю с ${this.client.guilds.cache.size} серверами, с общим количеством из ${memberCount} пользователей.`
      )
      .setFooter(
        'Команда выплнена' + this.client.owners[0].username,
        this.client.owners[0].displayAvatarURL()
      )
      .setTimestamp(this.client.user.createdAt);

    message.channel.send(embed);
  }
};
