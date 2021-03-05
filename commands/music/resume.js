const { Command } = require('discord.js-commando');

module.exports = class ResumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      aliases: ['resume-song', 'continue'],
      memberName: 'resume',
      group: 'music',
      description: 'Продолжает песню стоящею на паузе',
      guildOnly: true
    });
  }

  run(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Присоеденись к голосовому каналу и попробуй снова');
      return;
    }

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher === null
    ) {
      message.reply(':x: Сейчас ничего не играет');
      return;
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `:no_entry: Ты должен находиться в том же голосовом канале ,что и бот`
      );
      return;
    }

    message.reply(':play_pause: Продолжаем флексить');
    message.guild.musicData.songDispatcher.resume();
  }
};
