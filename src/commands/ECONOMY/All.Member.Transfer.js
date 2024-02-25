const { Client, Message, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Users = require('../../database/User');

module.exports = {
  name: "transferler",
  aliases: ["transferlerim"],
  kullanım: "transferler <@cartel/ID>",
  açıklama: "Belirlenen veya komutu kullanan kişi belirlediği taglı sayısını ve en son belirlediği taglı sayısını gösterir.",
  
  
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  execute: async function (client, message, args) {
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    uye = message.guild.members.cache.get(uye.id)
    const button1 = new ButtonBuilder()
                .setCustomId('geri')
                .setLabel('◀ Geri')
                .setStyle(ButtonStyle.Primary);
    const buttonkapat = new ButtonBuilder()
                .setCustomId('kapat')
 .setEmoji("929001437466357800")               
 .setStyle(ButtonStyle.Danger);
                
    const button2 = new ButtonBuilder()
                .setCustomId('ileri')
                .setLabel('İleri ▶')
                .setStyle(ButtonStyle.Primary);
    Users.findOne({_id: uye.id }, async (err, res) => {
      if (!res) return message.channel.send({embeds: [new EmbedBuilder().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: "png"})}).setDescription(`${uye} isimli üyenin transfer bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      if(!res.Transfers) return message.channel.send({embeds: [new EmbedBuilder().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: "png"})}).setDescription(`${uye} isimli üyenin transfer bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let pages = res.Transfers.sort((a, b) => b.Tarih - a.Tarih).chunk(20);
      var currentPage = 1
      if (!pages && !pages.length || !pages[currentPage - 1]) return message.channel.send({embeds: [new EmbedBuilder().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: "png"})}).setDescription(`${uye} isimli üyenin taglı bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let embed = new EmbedBuilder().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: "png"})}).setFooter({ text: `• ${currentPage} / ${pages.length}`})
      const row = new ActionRowBuilder().addComponents([button1, buttonkapat, button2]);
      if (message.deferred == false){
        await message.deferReply()
      };
      const curPage = await message.channel.send({
        embeds: [embed.setDescription(`${uye}, üyesin transfer bilgisi yükleniyor... Lütfen bekleyin...`)],
        components: [row], fetchReply: true,
      }).catch(err => {});
    
      await curPage.edit({embeds: [embed.setDescription(`${uye} isimli üyesinin toplamda \`${res.Transfers.length || 0}\` adet transferi mevcut.

${pages[currentPage - 1].map((value, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(value.Uye) ? message.guild.members.cache.get(value.Uye) : `<@${value.Uye}>`} \`${value.Tutar} ${value.Islem}\` (\`${tarihsel(value.Tarih)}\`)`).join("\n")} `)]}).catch(err => {})

      const filter = (i) => i.user.id == message.member.id

      const collector = await curPage.createMessageComponentCollector({
        filter,
        time: 30000,
      });

      collector.on("collect", async (i) => {
        switch (i.customId) {
          case "ileri":
            if (currentPage == pages.length) break;
            currentPage++;
            break;
          case "geri":
            if (currentPage == 1) break;
            currentPage--;
            break;
          default:
            break;
          case "kapat": 
            i.deferUpdate().catch(err => {});
            curPage.delete().catch(err => {})
            return message.react("✅");
        }
        await i.deferUpdate();
        await curPage.edit({
          embeds: [embed.setFooter({ text: `• ${currentPage} / ${pages.length}`}).setDescription(`${uye} isimli üyesinin toplamda \`${res.Transfers.length || 0}\` adet transferi mevcut.

${pages[currentPage - 1].map((value, index) => `\` ${index + 1} \` ${message.guild.members.cache.get(value.Uye) ? message.guild.members.cache.get(value.Uye) : `<@${value.Uye}>`} \`${value.Tutar} ${value.Islem}\` (\`${tarihsel(value.Tarih)}\`)`).join("\n")}`)]
        }).catch(err => {});
        collector.resetTimer();
      });
      collector.on("end", () => {
        if(curPage) curPage.edit({
          embeds: [embed.setFooter(`${config.SERVER_NAME ? config.SERVER_NAME : message.guild.name}`, message.guild.iconURL({extension: "png"})).setDescription(`${uye} isimli üyesinin toplamda \`${res.Transfers.length || 0}\` adet transferi mevcut.`)],
          components: [],
        }).catch(err => {});
      })
    })
  }
};

