module.exports = {
  name: "ping",
  description: "Ping me if you or this bot feel laggy",
  execute(message, args) {
    message.channel.send("**Pong.** Aku di sini~\nLatency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms");
  }
};
