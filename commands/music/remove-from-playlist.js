const { Command } = require('discord.js-commando');
const db = require('quick.db');

module.exports = class SaveToPlaylistCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-from-playlist',
      aliases: ['delete-song', 'remove-song'],
      group: 'music',
      memberName: 'remove-from-playlist',
      guildOnly: true,
      description: 'Удалить песню из плейлиста',
      args: [
        {
          key: 'playlist',
          prompt: 'Из какого плейлиста ты хочешь удалить видео?',
          type: 'string'
        },
        {
          key: 'index',
          prompt:
            'Каков индекс видео, которое ты хочешь удалить из сохраненного списка воспроизведения?',
          type: 'string',
          validate: function validateIndex(index) {
            return index > 0;
          }
        }
      ]
    });
  }

  async run(message, { playlist, index }) {
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
      if (savedPlaylistsClone[i].name == playlist) {
        found = true;
        location = i;
        break;
      }
    }
    if (found) {
      const urlsArrayClone = savedPlaylistsClone[location].urls;
      if (urlsArrayClone.length == 0) {
        message.reply(`**${playlist}** пуст`);
        return;
      }

      if (index > urlsArrayClone.length) {
        message.reply(
          `Индекс который ты указал больше длины плейлиста`
        );
        return;
      }
      const title = urlsArrayClone[index - 1].title;
      urlsArrayClone.splice(index - 1, 1);
      savedPlaylistsClone[location].urls = urlsArrayClone;
      db.set(message.member.id, { savedPlaylists: savedPlaylistsClone });
      message.reply(
        `Я удалил **${title}** из **${savedPlaylistsClone[location].name}**`
      );
      return;
    } else {
      message.reply(`Не существует плейлистас названием **${playlist}**`);
      return;
    }
  }
};
