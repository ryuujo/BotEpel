module.exports = {
  name: "ping",
  description: "Ping me if you or this bot feel laggy",
  execute(message, args) {
    var yourping = new Date().getTime() - message.createdTimestamp
    var apiping = Math.round(client.ws.ping)
    var botping = Math.round(bot.ws.ping)
    message.channel.send('**Pong.** Aku di sini~\nLatency is' + yourping + 'ms\nAPI Latency is' + apiping + 'ms\nBot Latency is' + botping + 'ms');
  }
};
