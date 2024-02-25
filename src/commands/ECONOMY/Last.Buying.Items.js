const { Client, Message, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Users = require('../../database/User');

module.exports = {
  name: "envanter",
  aliases: ["sonalımlar","sonsatınalımlar","satınalımlar","satınalınanlar"],
  kullanım: "envanter <@cartel/ID>",
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
      if (!res) return message.channel.send({embeds: [new EmbedBuilder().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: "png"})}).setDescription(`${uye} isimli üyenin satın alımı bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      if(!res.Inventory) return message.channel.send({embeds: [new EmbedBuilder().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: "png"})}).setDescription(`${uye} isimli üyenin satın alımı bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let pages = res.Inventory.sort((a, b) => b.Tarih - a.Tarih).chunk(20);
      var currentPage = 1
      if (!pages && !pages.length || !pages[currentPage - 1]) return message.channel.send({embeds: [new EmbedBuilder().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: "png"})}).setDescription(`${uye} isimli üyenin taglı bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
      let embed = new EmbedBuilder().setColor("Random").setAuthor({ name: uye.user.username, iconURL: uye.user.avatarURL({extension: "png"})}).setFooter(`${config.SERVER_NAME ? config.SERVER_NAME : message.guild.name} • ${currentPage} / ${pages.length}`, message.guild.iconURL({extension: "png"}))
      const row = new ActionRowBuilder().addComponents([button1, buttonkapat, button2]);
      if (message.deferred == false){
        await message.deferReply()
      };
      const curPage = await message.channel.send({
        embeds: [embed.setDescription(`${uye}, üyesin satın alımı bilgisi yükleniyor... Lütfen bekleyin...`)],
        components: [row], fetchReply: true,
      }).catch(err => {});
    
      await curPage.edit({embeds: [embed.setDescription(`${uye} isimli üyesinin toplamda \`${res.Inventory.length || 0}\` adet satın alımı mevcut.

${pages[currentPage - 1].map((value, index) => `\` ••❯ \` **${value.Name}** isimli ürünü **${value.Coin > 0 ? value.Coin.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ` ${config.SERVER_NAME} Parası${value.Gold > 0? " ve" : ""}` : ``} ${value.Gold > 0 ? value.Gold + ` Altın` : ``}** fiyatına satın aldı.`).join("\n")}`)]}).catch(err => {})

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
          embeds: [embed.setFooter({ text: `• ${currentPage} / ${pages.length}`}).setDescription(`${uye} isimli üyesinin toplamda \`${res.Inventory.length || 0}\` adet satın alımı mevcut.

${pages[currentPage - 1].map((value, index) => `\` ••❯ \` **${value.Name}** isimli ürünü **${value.Coin > 0 ? value.Coin + ` ${config.SERVER_NAME} Parası${value.Gold > 0? " ve" : ""}` : ``} ${value.Gold > 0 ? value.Gold + ` Altın` : ``}** fiyatına satın aldı.`).join("\n")}`)]
        }).catch(err => {});
        collector.resetTimer();
      });
      collector.on("end", () => {
        if(curPage) curPage.edit({
          embeds: [embed.setFooter({ text: `• ${currentPage} / ${pages.length}`}).setDescription(`${uye} isimli üyesinin toplamda \`${res.Inventory.length || 0}\` adet satın alımı mevcut.`)],
          components: [],
        }).catch(err => {});
      })
    })
  }
};

