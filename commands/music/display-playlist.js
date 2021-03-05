const { Command } = require('discord.js-commando');
const db = require('quick.db');
const Pagination = require('discord-paginationembed');

module.exports = class CreatePlaylistCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'display-playlist',
      group: 'music',
      aliases: ['my-playlist', 'show-playlist', 'songs-in'],
      memberName: 'display-playlist',
      guildOnly: true,
      description: 'Отображает список песен из плейлиста',
      args: [
        {
          key: 'playlistName',
          prompt: 'Какой плейлист ты хочешь отбразить?',
          type: 'string'
        }
      ]
    });
  }

  run(message, { playlistName }) {
    // check if user has playlists or user is in the db
    const dbUserFetch = db.get(message.member.id);
    if (!dbUserFetch) {
      message.reply('У вас нет плейлистов');
      return;
    }
    const savedPlaylistsClone = dbUserFetch.savedPlaylists;
    if (savedPlaylistsClone.length == 0) {
      message.reply('У вас нет плейлистов');
      return;
    }

    let found = false;
    let location;
    for (let i = 0; i < savedPlaylistsClone.length; i++) {
      if (savedPlaylistsClone[i].name == playlistName) {
        found = true;
        location = i;
        break;
      }
    }
    if (found) {
      const urlsArrayClone = savedPlaylistsClone[location].urls;
      if (urlsArrayClone.length == 0) {
        message.reply(`**${playlistName}** пуст`);
        return;
      }
      const savedSongsEmbed = new Pagination.FieldsEmbed()
        .setArray(urlsArrayClone)
        .setAuthorizedUsers([message.member.id])
        .setChannel(message.channel)
        .setElementsPerPage(8)
        .formatField('# - Title', function(e) {
          return `**${urlsArrayClone.indexOf(e) + 1}**: [${e.title}](${e.url})`;
        });
      savedSongsEmbed.embed.setColor('#ff7373').setTitle('Saved Songs');
      savedSongsEmbed.build();
    } else {
      message.reply(`У вас нет плейлиста с таким названием ${playlistName}`);
    }
  }
};
