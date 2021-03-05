const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const ISO6391 = require('iso-639-1');
const translate = require('@vitalets/google-translate-api');

module.exports = class TranslateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'translate',
      memberName: 'translate',
      group: 'other',
      description: 'Переводит что угодно используя Google translate.',
      throttling: {
        usages: 2,
        duration: 12
      },
      args: [
        {
          key: 'targetLang',
          prompt:
            'На каком языке ты хочешь увидеть ответ?',
          type: 'string',
          validate: function(text) {
            return text.length > 0;
          }
        },
        {
          key: 'queryText',
          prompt: 'Напиши что я должен перевести',
          type: 'string',
          validate: function(queryText) {
            return queryText.length < 3000;
          }
        }
      ]
    });
  }

  run(message, { queryText, targetLang }) {
    const langCode = ISO6391.getCode(targetLang);
    if (langCode === '')
      return message.channel.send(':x: Постарайся в следующий раз написать существующий язык');
    translate(queryText, { to: targetLang })
      .then(response => {
        const embed = new MessageEmbed()
          .setColor('#FF0000')
          .setTitle('Google Translate: ')
          .setURL('https://translate.google.com/')
          .setDescription(response.text)
          .setFooter('Переведно профессионалом битного мира Google Translate!');
        message.channel.send(embed);
      })
      .catch(error => {
        message.reply(
          ':x: Кажется все пошло не так, как я планировал'
        );
        console.error(error);
      });
  }
};
