const moment = require('moment');
const { name, version } = require('../package.json');
const { roles, textChannelID, prefix } = require('../config.js');
const { youtube } = require('../config/youtube');
const Vliver = require('../models').Vliver;
const Schedule = require('../models').Schedule;

module.exports = {
  name: 'announce',
  description: 'Announces Upcoming live and premiere immediately',
  args: true,
  async execute(message, args) {
    moment.locale('id');
    const messages =
      'Tulis formatnya seperti ini ya:\n> ```' +
      prefix +
      'announce [live/premiere] [Link Video Youtube]```';

    if (!message.member.roles.some((r) => roles.live.includes(r.name))) {
      return message.reply('Waduh, Kamu siapa ya?');
    }
    if (args.length !== 2) {
      return message.reply(messages);
    }
    if (
      args[0].toLowerCase() !== 'live' &&
      args[0].toLowerCase() !== 'premiere'
    ) {
      return message.reply(messages);
    }
    message.channel.send(
      'Mohon tunggu, sedang menyiapkan data untuk dikirimkan'
    );
    const timeFormat = 'Do MMMM YYYY, HH:mm';
    /* const dateSplit = args[0].split('/');
    const date =
      dateSplit[1] + '/' + dateSplit[0] + '/' + moment().format('YYYY');
    const dateTime = Date.parse(`${date} ${args[1]}`);
    const livestreamDateTime = moment(dateTime)
      .utcOffset('+07:00')
      .format(timeFormat); */
    const linkData = args[1].split('/');
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
      const youtubeLive = youtubeData.data.items[0].liveStreamingDetails;
      const videoDateTime = moment(youtubeLive.scheduledStartTime)
        .utcOffset('+07:00')
        .format(timeFormat);

      const liveEmbed = {
        color: 0x1bdaff,
        title: `Upcoming Livelyn`,
        thumbnail: {
          url:
            'https://yt3.ggpht.com/a/AATXAJxgPjxkVVGmmJBxMyajJqk57L9ySS4lBVqdEg=s288-c-k-c0xffffffff-no-rj-mo',
        },
        fields: [
          {
            name: `Tanggal & Waktu ${
              args[0].toLowerCase() === 'live' ? 'live' : 'premiere'
            }`,
            value: `${videoDateTime} UTC+7 / WIB`,
          },
          {
            name: 'Link Video Youtube',
            value: `https://www.youtube.com/watch?v=${youtubeId}`,
          },
          {
            name: `Judul ${
              args[0].toLowerCase() === 'live' ? 'Live' : 'Video'
            }`,
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
        `Hai Halo~ <@&${roleId.id}> people ヾ(＾-＾)ノ \n${
          args[0].toLowerCase() === 'live'
            ? `Bakal ada upcoming Livelyn lhoooo pada **${videoDateTime} WIB!**\nDateng yaaa~ UwU`
            : `Akan ada premiere lhooo~ pada **${videoDateTime} WIB!**\nYuk nonton bareng Epel~!`
        }`,
        { embed: liveEmbed }
      );
      return await message.reply(
        `Informasi ${args[0].toLowerCase()} sudah dikirim ke text channel tujuan.\nJudul ${args[0].toLowerCase() === 'live'? 'Livestream' : 'Video'}: ${
          youtubeInfo.title
        }\nJadwal ${args[0].toLowerCase() === 'live'? 'Livestream' : 'Premiere'}: ${videoDateTime} WIB / GMT+7`
      );
    } catch (err) {
      message.reply(
        `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
      );
    }
  },
};
