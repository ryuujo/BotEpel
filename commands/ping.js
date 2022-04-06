module.exports = {
  name: "ping",
  description: "Ping me if you or this bot feel laggy",
  execute(message, args) {
    const ping = resultMessage.createdTimestamp - message.createdTimestamp
    message.channel.send('**Pong.** Aku di sini~');
  }
};
