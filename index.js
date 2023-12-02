const Clients = require('./src/index.js');
const client = new Clients();
client.connect()
module.exports = client;
