const Discord = require('discord.js')
const coupons = require('../../API/coupons')
module.exports = {
  name: "coupons",
  description: "Coupons settings",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  options: [

    {
      name: 'view',
      description: "Affiche vos code",
      type: 1,
    },
    {
      name: 'create',
      description: "Crée votre code promo !",
      type: 1,
    },
    {
      name: 'delete',
      description: "Supprime votre code promo !",
      type: 1,
      options: [
        {
          name: 'code',
          description: 'Code du coupon à supprimer',
          type: 3,
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    
    if (interaction.options.getSubcommand() === 'create') {
      const db = await client.db.get('coupons_' + interaction.user.id) || []
      if (db.length === 1) return interaction.editReply('Vous ne pouvez avoir que 1 code promos !')
      try {
        const create = await coupons.create(code());
        await client?.db.push('coupons_' + interaction.user.id, {
          code: create.data.code,
          id: create.data.id,
          create: Date.now()
        })
        return interaction.editReply('Coupon créé avec succès !');
      } catch (error) {
        console.error('Erreur:', error.message);
        return  interaction.editReply('Une erreur s\'est produite.');
      }
    }

    if (interaction.options.getSubcommand() === 'view') {
      try {
        const db = await client.db.get('coupons_' + interaction.user.id);

        if (!db || db.length === 0) {
          return interaction.editReply('Vous n\'avez pas de code promo créé.');
        }

        const embed = new Discord.EmbedBuilder()
          .setTitle('Vos Codes Promo')
          .setColor(client.color);

        for (const coupon of db) {
          const use = await coupons.usage(coupon.id)
          embed.addFields({
            name: `\`${coupon.code}\``,
            value: `**ID:** ${coupon.id}\n**Créé** <t:${Math.floor(coupon.create / 1000)}:F> (<t:${Math.floor(coupon.create / 1000)}:R>)\n**Utilisations:** ${use}`
          });
        }

        return interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Erreur:', error.message);
       return interaction.editReply('Une erreur s\'est produite.');
      }
    }

    try {
      const codeadelete = interaction.options.getString('code');
      if (!codeadelete) {
        return interaction.editReply('Veuillez spécifier le code promo que vous souhaitez supprimer.');
      }

      const db = await client.db.get('coupons_' + interaction.user.id);
      if (!db || db.length === 0) {
        return interaction.editReply('Vous n\'avez pas de code promo créé.');
      }

      const couponsdeleteez = db.find(coupon => coupon.code === codeadelete);
      if (!couponsdeleteez) {
        return interaction.editReply('Code promo non trouvé.');
      }
      await coupons.del(db[0].id);
      const couponsupdate = db.find(coupon => coupon.code !== codeadelete) || [];
      await client.db.set(`coupons_${interaction.user.id}`, couponsupdate)

     return interaction.editReply(`Code promo ${codeadelete} supprimé avec succès.`);
    } catch (error) {
      console.error('Erreur :', error);
      interaction.editReply('```js\n' + error.message + '```');
    }

  }
}

function code() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const idLength = 16;
  let result = '';
  for (let i = 0; i < idLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}