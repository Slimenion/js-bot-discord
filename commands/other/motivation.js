const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class MotivationCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'motivation',
      aliases: ['motivational', 'motivation-quote', 'motivate'],
      group: 'other',
      memberName: 'motivation',
      description: 'Дает случайную мотивирующую цитату'
    });
  }
  run(message) {
    // thanks to https://type.fit/api/quotes

    const jsonQuotes = fs.readFileSync(
      '././resources/quotes/motivational.json',
      'utf8'
    );
    const quoteArray = JSON.parse(jsonQuotes).quotes;

    const randomQuote =
      quoteArray[Math.floor(Math.random() * quoteArray.length)];

    const quoteEmbed = new MessageEmbed()
      .setAuthor(
        'Мотивирующая цитата',
        'https://i.imgur.com/Cnr6cQb.png'
      )
      .setDescription(`*"${randomQuote.text}*"\n\n-${randomQuote.author}`)
      .setTimestamp()
      .setColor('#FFD77A');
    return message.channel.send(quoteEmbed);
  }
};
