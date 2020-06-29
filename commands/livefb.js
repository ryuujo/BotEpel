const moment = require('moment');
const { name, version } = require('../package.json');
const { roles, textChannelID, prefix } = require('../config.js');
const Vliver = require('../models').Vliver;
const Schedule = require('../models').Schedule;

module.exports = {
  name: 'livefb',
  description: 'Announces upcoming live immediately on Facebook',
  args: true,
  async execute(message, args) {
    moment.locale('id');
    const messages =
      'Tulis formatnya seperti ini ya:\n> ```' +
      prefix +
      'live [Tanggal Livestream (DD/MM)] [Waktu Livestream dalam WIB / GMT+7 (HH:MM)] [Link Video Facebook]```';
    if (!message.member.roles.some((r) => roles.live.includes(r.name))) {
      return message.reply('Waduh, kamu siapa ya?');
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
    const livestreamDateTimeJapan = moment(dateTime)
      .utcOffset('+09:00')
      .format(timeFormat);
    const linkData = args[2].split('/');
    if (linkData[0] !== 'https:' || linkData[3] === '') {
      return message.reply(messages);
    }
    try {
      const liveEmbed = {
        color: 0x1bdaff,
        title: `Upcoming Livelyn di Facebook`,
        thumbnail: {
          url:
            'https://yt3.ggpht.com/a/AATXAJxgPjxkVVGmmJBxMyajJqk57L9ySS4lBVqdEg=s288-c-k-c0xffffffff-no-rj-mo',
        },
        fields: [
          {
            name: 'Tanggal & Waktu Livestream',
            value: `${livestreamDateTime} GMT+7 / WIB \n${livestreamDateTimeJapan} GMT+9 / JST`,
          },
          {
            name: 'Link Video Facebook',
            value: args[2],
          },
        ],
        footer: {
          text: `${name} v${version} - This message was created on ${moment()
            .utcOffset('+07:00')
            .format(timeFormat)}`,
        },
      };
      const channel = message.guild.channels.get(textChannelID.live);
      const roleId = message.guild.roles.find(
        r => r.name === "Epelable"
      );
      await channel.send(
        `Hai Halo~ <@&${roleId.id}> people ヾ(＾-＾)ノ \nBakal ada upcoming Livelyn lhoooo pada **${livestreamDateTime} WIB!**\nDateng yaaa~ UwU`,
        { embed: liveEmbed }
      );
      return await message.reply(
        `Informasi live FB sudah dikirim ke text channel tujuan.\nJadwal live: ${livestreamDateTime} WIB / GMT+7`
      );
    } catch (err) {
      message.reply(
        `Ada sesuatu yang salah, tapi itu bukan kamu: ${err.message}`
      );
    }
  },
};
