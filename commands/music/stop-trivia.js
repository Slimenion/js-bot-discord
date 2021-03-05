const { Command } = require('discord.js-commando');

module.exports = class StopMusicTriviaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop-trivia',
      aliases: [
        'stop-music-trivia',
        'skip-trivia',
        'end-trivia',
        'stop-trivia'
      ],
      memberName: 'stop-trivia',
      group: 'music',
      description: 'Экстренная остановка викторины',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT']
    });
  }
  run(message) {
    if (!message.guild.triviaData.isTriviaRunning) {
      message.reply(':x: Сейчас не идет никакой викторины');
      return;
    }

    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      message.reply(':no_entry: Я не телепат. Присоеденись в канал и попробуй снова');
      return;
    }

    if (!message.guild.triviaData.triviaScore.has(message.author.username)) {
      message.reply(
        ':stop_sign: Здесь работает правило Тараса Буьбы(тот кто породил и участвовал в этом может убить это)'
      );
      return;
    }

    message.guild.triviaData.triviaQueue.length = 0;
    message.guild.triviaData.wasTriviaEndCalled = true;
    message.guild.triviaData.triviaScore.clear();
    message.guild.musicData.songDispatcher.end();
    return;
  }
};
