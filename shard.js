const { ShardingManager } = require("discord.js");
const config = require('./src/config')
const manager = new ShardingManager('./index.js', {
    token: config.token,
    totalShards: "auto",
    respawn: true,
    autoSpawn: true,
    shardList: "auto"
})

manager.on("shardCreate", async (shard) => {
    console.clear()
    console.log(`[SHARD #${shard.id}]: Lancée avec succès`);
});

manager.on("shardDisconnect", (shard) => {
    console.clear()
    console.log(`[SHARD #${shard.id}]: Déconnectée`);
});

manager.spawn();
