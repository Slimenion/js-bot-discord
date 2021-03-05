const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class PollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'poll',
      group: 'other',
      memberName: 'poll',
      description: 'Создает опрос с 10 выборами ответа.',
      args: [
        {
          key: 'question',
          prompt: 'Какой вопрос вы хотите добавить?',
          type: 'string',
          validate: function validateQuestion(question) {
            if (question.length < 101 && question.length > 11) return true;
            return 'Вопросы для голосования должны иметь длину от 10 до 100 символов.';
          }
        },
        {
          key: 'options',
          prompt: 'Какие варианты ответа ты хочешь добавить?',
          type: 'string',
          validate: function validateOptions(options) {
            var optionsList = options.split(',');
            if (optionsList.length > 1) return true;
            return 'Что Россия сильно давит? Вариантов ответа должно быть больше одного.';
          }
        },
        {
          key: 'time',
          prompt: 'Как долго должен длиться опрос в минутах?',
          type: 'integer',
          default: 0,
          validate: function validateTime(time) {
            if (time >= 0 && time <= 60) return true;
            return 'Напиши от 0 до 60.';
          }
        }
      ]
    });
  }

  run(msg, { question, options, time }) {
    var emojiList = [
      '1⃣',
      '2⃣',
      '3⃣',
      '4⃣',
      '5⃣',
      '6⃣',
      '7⃣',
      '8⃣',
      '9⃣',
      '🔟'
    ];
    var optionsList = options.split(',');

    var optionsText = '';
    for (var i = 0; i < optionsList.length; i++) {
      optionsText += emojiList[i] + ' ' + optionsList[i] + '\n';
    }

    var embed = new MessageEmbed()
      .setTitle(':ballot_box: ' + question)
      .setDescription(optionsText)
      .setAuthor(msg.author.username, msg.author.displayAvatarURL())
      .setColor(`#FF0000`)
      .setTimestamp();

    if (time) {
      embed.setFooter(`Опрос начался и продлится ${time} минут`);
    } else {
      embed.setFooter(`Опрос начался и не имеет времени окончания`);
    }

    msg.delete(); // Remove the user's command message

    msg.channel
      .send({ embed }) // Definitely use a 2d array here..
      .then(async function(message) {
        var reactionArray = [];
        for (var i = 0; i < optionsList.length; i++) {
          reactionArray[i] = await message.react(emojiList[i]);
        }

        if (time) {
          setTimeout(() => {
            // Re-fetch the message and get reaction counts
            message.channel.messages
              .fetch(message.id)
              .then(async function(message) {
                var reactionCountsArray = [];
                for (var i = 0; i < optionsList.length; i++) {
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
                  winnersText = ':x: Никто не голосовал. Вообще-то здесь ваш голос решает , осбено если он не протеворечит воле Бога';
                } else {
                  for (let i = 0; i < indexMax.length; i++) {
                    winnersText +=
                      emojiList[indexMax[i]] +
                      ' ' +
                      optionsList[indexMax[i]] +
                      ' (' +
                      reactionCountsArray[indexMax[i]] +
                      ' голосов\n';
                  }
                }

                embed.addField(':crown: **Побеждает:**', winnersText);
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

    return;
  }
};
