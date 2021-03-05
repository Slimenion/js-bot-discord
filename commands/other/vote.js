const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class VoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'vote',
      group: 'other',
      memberName: 'vote',
      description: "Начинаю да/нет/не знаю голосование.",
      args: [
        {
          key: 'question',
          prompt: 'Что мы сегодня вынесем на суд?',
          type: 'string',
          validate: function validateQuestion(question) {
            if (question.length < 101 && question.length > 11) return true;
            return 'Вопрос должен быть от 10 до 100 символов.';
          }
        },
        {
          key: 'time',
          prompt: '(Опционально) Сколько по времени должен длиться опрос?',
          type: 'integer',
          default: 0,
          validate: function validateTime(time) {
            if (time >= 0 && time <= 60) return true;
            return 'Введи значения между 0 и 60 минутами.';
          }
        }
      ]
    });
  }

  run(msg, { question, time }) {
    var emojiList = ['👍', '👎', '🤷'];
    var embed = new MessageEmbed()
      .setTitle(':ballot_box: ' + question)
      .setDescription('')
      .setAuthor(msg.author.username, msg.author.displayAvatarURL())
      .setColor(`#FF0000`)
      .setTimestamp();

    if (time) {
      embed.setFooter(`Голосование закончится через ${time} минут`);
    } else {
      embed.setFooter(`Голосование началось и будет идти пока вам не надоест`);
    }

    msg.delete(); // Remove the user's command message

    msg.channel
      .send({ embed }) // Use a 2d array?
      .then(async function(message) {
        var reactionArray = [];
        reactionArray[0] = await message.react(emojiList[0]);
        reactionArray[1] = await message.react(emojiList[1]);
        reactionArray[2] = await message.react(emojiList[2]);

        if (time) {
          setTimeout(() => {
            // Re-fetch the message and get reaction counts
            message.channel.messages
              .fetch(message.id)
              .then(async function(message) {
                var reactionCountsArray = [];
                for (var i = 0; i < reactionArray.length; i++) {
                  reactionCountsArray[i] =
                    message.reactions.cache.get(emojiList[i]).count - 1;
                }

                // Find winner(s)
                var max = -Infinity,
                  indexMax = [];
                for (let i = 0; i < reactionCountsArray.length; ++i)
                  if (reactionCountsArray[i] > max)
                    (max = reactionCountsArray[i]), (indexMax = [i]);
                  else if (reactionCountsArray[i] === max) indexMax.push(i);

                // Display winner(s)
                var winnersText = '';
                if (reactionCountsArray[indexMax[0]] == 0) {
                  winnersText = ':x: Никто не проголосовал!';
                } else {
                  for (let i = 0; i < indexMax.length; i++) {
                    winnersText +=
                      emojiList[indexMax[i]] +
                      ' (' +
                      reactionCountsArray[indexMax[i]] +
                      ' голосов)\n';
                  }
                }
                embed.addField(':crown: **Winner(s):**', winnersText);
                embed.setFooter(
                  `Голосование закрыто! Оно длилось ${time} мин.`
                );
                embed.setTimestamp();
                message.edit('', embed);
              });
          }, time * 60 * 1000);
        }
      })
      .catch(console.error);
  }
};
