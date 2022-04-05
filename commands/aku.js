const config = require('../config.js');

module.exports = {
  name: 'aku',
  description: 'Joke bapacc bapacc',
  execute(message, args) {
    if (args.length > 0) {
      message.channel.send(`Halo ${args[0]}, aku BotEpel`);
      return;
    }
    return message.reply('Aku siapa?');
  },
};