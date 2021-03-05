const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const db = require('quick.db');
const { prefix } = require('../../config.json');

module.exports = class MusicTriviaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'music-trivia',
      memberName: 'music-trivia',
      aliases: ['music-quiz', 'start-quiz', 'mtrivia'],
      group: 'music',
      description: 'Запусти музыкальную викторину со своими друзьями',
      guildOnly: true,
      clientPermissions: ['SPEAK', 'CONNECT'],
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          key: 'numberOfSongs',
          prompt: 'Какое количество песен ты хочешь поставить?',
          type: 'integer',
          min: 1,
          max: 15
        }
      ]
    });
  }
  async run(message, { numberOfSongs }) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply('Я не телепат присоеденись в комнату и попробуй снова');
      return;
    }
    if (message.guild.musicData.isPlaying === true)
      return message.channel.send('Сейчас уже включена викторина или песня');
    message.guild.musicData.isPlaying = true;
    message.guild.triviaData.isTriviaRunning = true;
    // fetch link array from txt file
    const jsonSongs = fs.readFileSync(
      '././resources/music/musictrivia.json',
      'utf8'
    );
    var videoDataArray = JSON.parse(jsonSongs).songs;
    // get random numberOfSongs videos from array
    const randomXVideoLinks = MusicTriviaCommand.getRandom(
      videoDataArray,
      numberOfSongs
    ); // get x random urls
    // create and send info embed
    const infoEmbed = new MessageEmbed()
      .setColor('#ff7373')
      .setTitle(':notes: Starting Music Quiz!')
      .setDescription(
        `Приготовтесь! Сейчас будет ${numberOfSongs} песен, у вас будет 30 секунд на каждую чтобы написать название песни или исполнителя. Удачи!
        Вы можете досрочно остановить викторину командой ${prefix}end-trivia `
      );
    message.channel.send(infoEmbed);
    // init quiz queue
    // turn each vid to song object

    for (let i = 0; i < randomXVideoLinks.length; i++) {
      const song = {
        url: randomXVideoLinks[i].url,
        singer: randomXVideoLinks[i].singer,
        title: randomXVideoLinks[i].title,
        voiceChannel
      };
      message.guild.triviaData.triviaQueue.push(song);
    }
    const channelInfo = Array.from(
      message.member.voice.channel.members.entries()
    );
    channelInfo.forEach(user => {
      if (user[1].user.bot) return;
      message.guild.triviaData.triviaScore.set(user[1].user.username, 0);
    });
    MusicTriviaCommand.playQuizSong(
      message.guild.triviaData.triviaQueue,
      message
    );
  }

  static async playQuizSong(queue, message) {
    const randomStartTime = Math.floor(Math.random() * (80 - 30 + 1)) + 30;
    var classThis = this;
    queue[0].voiceChannel.join().then(function(connection) {
      const dispatcher = connection
        .play(
          ytdl(queue[0].url, {
            // filter: 'audio',
            quality: 'highestaudio',
            highWaterMark: 1024 * 1024 * 1024
          }),
          {
            seek: randomStartTime
          }
        )
        .on('error', async function(e) {
          message.reply('Не удалось воспроизвести эту песню');
          console.log(e);
          if (queue.length > 1) {
            queue.shift();
            classThis.playQuizSong(queue, message);
            return;
          }
          const sortedScoreMap = new Map(
            [...message.guild.triviaData.triviaScore.entries()].sort(function(
              a,
              b
            ) {
              return b[1] - a[1];
            })
          );
          const embed = new MessageEmbed()
            .setColor('#ff7373')
            .setTitle(`Результаты викторины:`)
            .setDescription(
              classThis.getLeaderBoard(Array.from(sortedScoreMap.entries()))
            );
          message.channel.send(embed);
          message.guild.musicData.isPlaying = false;
          message.guild.triviaData.isTriviaRunning = false;
          message.guild.triviaData.triviaScore.clear();
          message.guild.musicData.songDispatcher = null;
          message.guild.me.voice.channel.leave();
          return;
        })
        .on('start', function() {
          message.guild.musicData.songDispatcher = dispatcher;

          if (!db.get(`${message.guild.id}.serverSettings.volume`))
            dispatcher.setVolume(message.guild.musicData.volume);
          else
            dispatcher.setVolume(
              db.get(`${message.guild.id}.serverSettings.volume`)
            );

          let songNameFound = false;
          let songSingerFound = false;

          const filter = msg =>
            message.guild.triviaData.triviaScore.has(msg.author.username);
          const collector = message.channel.createMessageCollector(filter, {
            time: 30000
          });

          collector.on('collect', msg => {
            if (!message.guild.triviaData.triviaScore.has(msg.author.username))
              return;
            if (msg.content.startsWith(prefix)) return;
            // if user guessed song name
            if (msg.content.toLowerCase() === queue[0].title.toLowerCase()) {
              if (songNameFound) return; // if song name already found
              songNameFound = true;

              if (songNameFound && songSingerFound) {
                message.guild.triviaData.triviaScore.set(
                  msg.author.username,
                  message.guild.triviaData.triviaScore.get(
                    msg.author.username
                  ) + 1
                );
                msg.react('☑');
                return collector.stop();
              }
              message.guild.triviaData.triviaScore.set(
                msg.author.username,
                message.guild.triviaData.triviaScore.get(msg.author.username) +
                  1
              );
              msg.react('☑');
            }
            // if user guessed singer
            else if (
              msg.content.toLowerCase() === queue[0].singer.toLowerCase()
            ) {
              if (songSingerFound) return;
              songSingerFound = true;
              if (songNameFound && songSingerFound) {
                message.guild.triviaData.triviaScore.set(
                  msg.author.username,
                  message.guild.triviaData.triviaScore.get(
                    msg.author.username
                  ) + 1
                );
                msg.react('☑');
                return collector.stop();
              }

              message.guild.triviaData.triviaScore.set(
                msg.author.username,
                message.guild.triviaData.triviaScore.get(msg.author.username) +
                  1
              );
              msg.react('☑');
            } else if (
              msg.content.toLowerCase() ===
                queue[0].singer.toLowerCase() +
                  ' ' +
                  queue[0].title.toLowerCase() ||
              msg.content.toLowerCase() ===
                queue[0].title.toLowerCase() +
                  ' ' +
                  queue[0].singer.toLowerCase()
            ) {
              if (
                (songSingerFound && !songNameFound) ||
                (songNameFound && !songSingerFound)
              ) {
                message.guild.triviaData.triviaScore.set(
                  msg.author.username,
                  message.guild.triviaData.triviaScore.get(
                    msg.author.username
                  ) + 1
                );
                msg.react('☑');
                return collector.stop();
              }
              message.guild.triviaData.triviaScore.set(
                msg.author.username,
                message.guild.triviaData.triviaScore.get(msg.author.username) +
                  2
              );
              msg.react('☑');
              return collector.stop();
            } else {
              // wrong answer
              return msg.react('❌');
            }
          });

          collector.on('end', function() {
            /*
            The reason for this if statement is that we don't want to get an
            empty embed returned via chat by the bot if end-trivia command was called
            */
            if (message.guild.triviaData.wasTriviaEndCalled) {
              message.guild.triviaData.wasTriviaEndCalled = false;
              return;
            }

            const sortedScoreMap = new Map(
              [...message.guild.triviaData.triviaScore.entries()].sort(function(
                a,
                b
              ) {
                return b[1] - a[1];
              })
            );

            const song = `${classThis.capitalize_Words(
              queue[0].singer
            )}: ${classThis.capitalize_Words(queue[0].title)}`;

            const embed = new MessageEmbed()
              .setColor('#ff7373')
              .setTitle(`Сей шедешвр назывался:  ${song}`)
              .setDescription(
                classThis.getLeaderBoard(Array.from(sortedScoreMap.entries()))
              );

            message.channel.send(embed);
            queue.shift();
            dispatcher.end();
            return;
          });
        })
        .on('finish', function() {
          if (queue.length >= 1) {
            return classThis.playQuizSong(queue, message);
          } else {
            if (message.guild.triviaData.wasTriviaEndCalled) {
              message.guild.musicData.isPlaying = false;
              message.guild.triviaData.isTriviaRunning = false;
              message.guild.musicData.songDispatcher = null;
              message.guild.me.voice.channel.leave();
              return;
            }
            const sortedScoreMap = new Map(
              [...message.guild.triviaData.triviaScore.entries()].sort(function(
                a,
                b
              ) {
                return b[1] - a[1];
              })
            );
            const embed = new MessageEmbed()
              .setColor('#ff7373')
              .setTitle(`Результаты музыкальной викторины:`)
              .setDescription(
                classThis.getLeaderBoard(Array.from(sortedScoreMap.entries()))
              );
            message.channel.send(embed);
            message.guild.musicData.isPlaying = false;
            message.guild.triviaData.isTriviaRunning = false;
            message.guild.triviaData.triviaScore.clear();
            message.guild.musicData.songDispatcher = null;
            message.guild.me.voice.channel.leave();
            return;
          }
        });
    });
  }

  static getRandom(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError('getRandom: взято элементов больше чем доступно!');
    while (n--) {
      var x = Math.floor(Math.random() * len);
      // prettier-ignore
      result[n] = arr[(x in taken) ? taken[x] : x];
      // prettier-ignore
      taken[x] = (--len in taken) ? taken[len] : len;
      // prettier-ignore-end
    }
    return result;
  }

  static getLeaderBoard(arr) {
    if (!arr) return;
    if (!arr[0]) return; // issue #422
    let leaderBoard = '';

    leaderBoard = `👑   **${arr[0][0]}:** ${arr[0][1]}  очков`;

    if (arr.length > 1) {
      for (let i = 1; i < arr.length; i++) {
        leaderBoard =
          leaderBoard + `\n\n   ${i + 1}: ${arr[i][0]}: ${arr[i][1]}  очков`;
      }
    }
    return leaderBoard;
  }
  // https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
  static capitalize_Words(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
};
