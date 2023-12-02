const { readdirSync } = require('fs');
const { PermissionsBitField, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

module.exports = (client) => {
    const data = [];
    readdirSync("./src/slashCommands/").forEach((fich) => {
        const fichier = readdirSync(`./src/slashCommands/${fich}/`).filter((files) => files.endsWith(".js"));

        for (const file of fichier) {
            const cmd = require(`../../src/slashCommands/${fich}/${file}`);

            if (!cmd.name) return console.error(`Erreur: ${cmd.split(".")[0]} merci de mettre un nom.`);

            if (!cmd.description) return console.error(`Erreur: ${cmd.split(".")[0]} merci de mettre un description.`);

            client.slashCommands.set(cmd.name, cmd);

            data.push({
                name: cmd.name,
                description: cmd.description,
                type: cmd.type,
                options: cmd.options ? cmd.options : null,
                default_userPerms: cmd.default_permission ? cmd.default_permission : null,
                default_member_permissions: cmd.default_member_permissions ? PermissionsBitField.resolve(cmd.default_member_permissions).toString() : null
            });
        }
    });
    const rest = new REST({ version: '10' }).setToken(client.config.token);
    (async () => {
        try {
            await rest.put(Routes.applicationCommands(client.config.clientID), { body: data });
        } catch (error) {
            console.error(error);
        }
    })();
}
