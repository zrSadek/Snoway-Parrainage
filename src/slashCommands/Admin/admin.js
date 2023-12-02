const Discord = require('discord.js')
const transaction = require('../../API/vente')
module.exports = {
    name: 'admin',
    description: 'Commande admin',
    options: [
        {
            name: 'transactions',
            description: 'Affiche les transactions',
            type: 1,
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const dev = client.config.admin.dev.includes(interaction.user.id);
        const staff = interaction.member.roles.cache.some(role => role.id === client.config.admin.staff);

        if (!dev && !staff) {
            return interaction.editReply({ content: "Tu ne fais pas partie de l'équipe Snoway.", flags: 64 });
        }

        if (interaction.options.getSubcommand() === 'transactions') {
            const api = await transaction.transtions();
            const quantiter = {};

            api.forEach(transc => {
                const email = transc.customer_information.email;
                const acheter = transc.products ? transc.products[0].variants[0].quantity : 0;

                if (email) {
                    if (!quantiter[email]) {
                        quantiter[email] = acheter;
                    } else {
                        quantiter[email] += acheter;
                    }
                }
            });

            const listclients = Object.entries(quantiter).map(([email, buy]) => {
                return { email, buy };
            });

            const gg = listclients.sort((a, b) => b.buy - a.buy);
            const description = gg.map((entry, index) => {
                return `${index + 1}) \`${entry.email}\` (**${entry.buy}** produits)`;
            }).join('\n');

            const embed = new Discord.EmbedBuilder()
                .setTitle('Buyer SellApp')
                .setColor(client.color)
                .setFooter(client.footer)
                .setDescription(description)
            return interaction.editReply({ embeds: [embed] });
        }

    }
}