const { Client, Collection} = require("discord.js");
const {QuickDB} = require("quick.db")
const db = new QuickDB();

class Clients extends Client {
  constructor() {
    super({
      presence: {
        status: 'dnd',
        activities: [
          {
            name: `SellApp Snoway`,
            type: 1,
            url: "https://twitch.tv/oni145"
          },
        ],
      },
      intents: [3276799],
      partials: [
        1, 2, 5, 3,
        4, 6, 0
      ]
    });
    this.config = require('./config.js');
    this.db = db;
    this.slashCommands = new Collection();
    this.color = 0xFFFFFF;
    this.footer = {
      text: "© Snoway Parrainage"
    },
    ['slashCommand', 'events'].forEach((handler) => {
      require(`./handlers/${handler}`)(this);
    });
  }

  connect() {
    return super.login(this.config.token);
  }
}

module.exports = Clients;