const moment = require('moment');
const { name, version } = require('../package.json');
const { roles, textChannelID, prefix } = require('../config.js');
const { youtube } = require('../config/youtube');
const Vliver = require('../models').Vliver;
const Schedule = require('../models').Schedule;

module.exports = {
  name: 'premiere',
  description: 'Announces Upcoming premiere immediately',
  args: true,
  async execute(message, args) {
    moment.locale('id');
    const messages =
      'Tulis formatnya seperti ini ya:\n> ```' +
      prefix +
      'premiere [Tanggal Premiere (DD/MM)] [Waktu Premiere dalam WIB / GMT+7 (HH:MM)] [Link Video Youtube]```';

    if (!message.member.roles.some((r) => roles.live.includes(r.name))) {
      return message.reply('Waduh, Kamu siapa ya?');
    }
    if (args.length !== 3) {
      return message.reply(messages);
    }
    message.channel.send(
      'Mohon tunggu, sedang menyiapkan data untuk dikirimkan'
    );
    const timeFormat = 'Do MMMM YYYY, HH:mm';
    const dateSplit = args[0].split('/');
    const date =
      dateSplit[1] + '/' + dateSplit[0] + '/' + moment().format('YYYY');
    const dateTime = Date.parse(`${date} ${args[1]}`);
    const livestreamDateTime = moment(dateTime)
      .utcOffset('+07:00')
      .format(timeFormat);
    const linkData = args[2].split('/');
    let youtubeId;
    if (linkData[0] !== 'https:' || linkData[3] === '') {
      return message.reply(messages);
    }
    switch (linkData[2]) {
      case 'www.youtube.com':
        const paramData = linkData[3].split('=');
        youtubeId = paramData[1].split('&', 1)[0];
        break;
      case 'youtu.be':
        youtubeId = linkData[3];
        break;
      default:
        return message.reply(messages);
    }
    if (youtubeId === undefined) {
      return message.reply(messages);
    }
    try {
      const config = {
        id: youtubeId,
        part: 'snippet,liveStreamingDetails',
        fields:
          'pageInfo,items(snippet(title,thumbnails/standard/url),liveStreamingDetails)',
      };
      const youtubeData = await youtube.videos.list(config);
      const youtubeInfo = youtubeData.data.items[0].snippet;
      const liveEmbed = {
        color: 0x1bdaff,
        title: `Video baru Epel`,
        thumbnail: {
          url:
            'https://yt3.ggpht.com/a/AATXAJxgPjxkVVGmmJBxMyajJqk57L9ySS4lBVqdEg=s288-c-k-c0xffffffff-no-rj-mo',
        },
        fields: [
          {
            name: 'Tanggal & Waktu Premiere',
            value: `${livestreamDateTime} GMT+7 / WIB`,
          },
          {
            name: 'Link Video Youtube',
            value: `https://www.youtube.com/watch?v=${youtubeId}`,
          },
          {
            name: 'Judul Video',
            value: youtubeInfo.title,
          },
        ],
        image: {
          url: youtubeInfo.thumbnails.standard.url,
        },
        footer: {
          text: `${name} v${version} - This message was created on ${moment()
            .utcOffset('+07:00')
            .format(timeFormat)}`,
        },
      };
      const channel = message.guild.channels.get(textChannelID.live);
      const roleId = message.guild.roles.find((r) => r.name === 'Epelable');
      await channel.send(
        `Hai Halo~ <@&${roleId.id}> people ヾ(＾-＾)ノ \nAkan ada premiere lhooo~ **${livestreamDateTime} WIB!**\nYuk nonton bareng Epel~!`,
        { embed: liveEmbed }
      );
      return await message.reply(
        `Informasi premiere sudah dikirim ke text channel tujuan.\nJudul Premiere: ${youtubeInfo.title}\nJadwal live: ${livestreamDateTime} WIB / GMT+7`
      );
    } catch (err) {
      message.reply(
        `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
      );
    }
  },
};
