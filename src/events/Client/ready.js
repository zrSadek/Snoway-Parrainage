module.exports = {
  name: "ready",
  run: async (client) => {
    console.log(client.user.tag + ` (` + client.user.id + `) viens de se connecté ! (${client.guilds.cache.size} servers / ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()} users / ${client.slashCommands.size} commands)`)

  }
}

