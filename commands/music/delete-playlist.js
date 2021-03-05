const { Command } = require('discord.js-commando');
const db = require('quick.db');

module.exports = class DeletePlaylistCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delete-playlist',
      group: 'music',
      memberName: 'delete-playlist',
      guildOnly: true,
      description: 'Удаляет сохраненый плейлист',
      args: [
        {
          key: 'playlistName',
          prompt: 'Какой плейлист ты хочешь удалить?',
          type: 'string'
        }
      ]
    });
  }

  run(message, { playlistName }) {
    // check if user has playlists or user is in the db
    const dbUserFetch = db.get(message.member.id);
    if (!dbUserFetch) {
      message.reply('У тебя нет плейлистов');
      return;
    }
    const savedPlaylistsClone = dbUserFetch.savedPlaylists;
    if (savedPlaylistsClone.length == 0) {
      message.reply('У тебя нет плейлистов');
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
      savedPlaylistsClone.splice(location, 1);
      db.set(message.member.id, { savedPlaylists: savedPlaylistsClone });
      message.reply(`Плейлист **${playlistName}** успешно удален!`);
    } else {
      message.reply(`Нет плейлиста с таким именнем ${playlistName}`);
    }
  }
};
