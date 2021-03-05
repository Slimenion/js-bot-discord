const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class EightBallCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'helpme',
      aliases: ['help_me'],
      memberName: 'helpme',
      group: 'other',
      description: 'Пасхалка'
    });
  }

  run(message) {
    message.channel.send('Help!');
    message.channel.send('I need somebody');
    message.channel.send('(Help!) not just anybody');
    message.channel.send('(Help!) you know I need someone');
    message.channel.send('Heeeeeeeeeeeelp!');
    message.channel.send('I never needed anybodys help in any way');
    message.channel.send('But now these days are gone, I am not so self assured (but now these days are gone)');
    message.channel.send('(And now I find) Now I find Ive changed my mind and opened up the doors');
    message.channel.send('Help me if you can, Im feeling down');
    message.channel.send('And I do appreciate you being round');
    message.channel.send('Help me get my feet back on the ground');
    message.channel.send('Wont you please, please help me?');
    message.channel.send('And now my life has changed in oh so many ways (and now my life has changed)');
    message.channel.send('My independence seems to vanish in the haze');
    message.channel.send('But every now and then I feel so insecure (I know that I)');
    message.channel.send('I know that I just need you like Ive never done before');
    message.channel.send('Help me if you can, Im feeling down');
    message.channel.send('And I do appreciate you being round');
    message.channel.send('Help me get my feet back on the ground');
    message.channel.send('Wont you please, please help me');
    message.channel.send('When I was younger, so much younger than today');
    message.channel.send('I never needed anybodys help in any way');
    message.channel.send('But now these days are gone, Im not so self assured (but now these days are gone)')
    message.channel.send('(And now I find) now I find I ve changed my mind and opened up the doors')
    message.channel.send('Help me if you can, Im feeling down');
    message.channel.send('And I do appreciate you being round');
    message.channel.send('Help me get my feet back on the ground');
    message.channel.send('Wont you please, please help me, help me, help me, ooh');
    message.channel.send('↓');
    message.channel.send('↓');
    message.channel.send('↓');
    message.channel.send('↓');
    message.channel.send('Трек был подготовлен специально для человека судьбы (И да она залагана специальн)...');
  }
};
