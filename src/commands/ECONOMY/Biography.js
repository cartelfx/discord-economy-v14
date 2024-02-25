const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Upstaff = require('../../database/User')
module.exports = {
    name: "bio",
    aliases: ["biyografi","bio","biography"],
    kullanım: "biyografi <[En az: 5, En fazla: 120]>",
    açıklama: "Belirlenen yetkilinin sunucu içerisinde ki bilgileri gösterir ve yükseltir düşürür.",
    
   /**
   * @param {Client} client 
   */
  onLoad: async function (client) {
    
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  execute: async function (client, message, args) {
        let ownedbio = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("değiştir")
            .setLabel(await client.Economy.bakiyeGöster(message.member.id, 0) || 0 >= 1 ? "💭 Biyografi Güncelleme" : "Güncelleyemezsin!")
            .setDisabled(await client.Economy.bakiyeGöster(message.member.id, 0) || 0 >= 1 ? false : true)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("sat")
            .setLabel("💵 2 Altın'a Geri Sat")
            .setStyle(ButtonStyle.Secondary)
        )
        let acheck = await Upstaff.findOne({_id: message.member.id})
        if(acheck && acheck.Biography) {

            message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`Daha önce biyografi satın almışsın! :tada:
Şuan ki biyografin: \`${acheck.Biography}\``).setAuthor({ name: message.member.user.username, iconURL: message.member.avatarURL({extension: "png"})})], components: [ownedbio]}).then(msg => {
                var filter = (i) => i.user.id == message.member.id && i.customId == "sat" || i.customId == "değiştir"
                let collector = msg.createMessageComponentCollector({filter: filter, time: 60000})
                collector.on('collect', async (i) => {
                    if(i.customId == "sat") {
                        await Upstaff.updateOne({_id: message.member.id}, { $inc: {"Gold": 2}, $unset: { "Biography": "xd" }}, {upsert: true})
                        await i.reply({content: `Başarıyla **2 Altın** fiyatına biygorafini sattın.`, ephemeral: true})
                        msg.delete().catch(err => {})
                        message.react("✅")
                    }
                    if(i.customId == "değiştir") {
                        let goldcheck = await client.Economy.bakiyeGöster(message.member.id, 0) || 0
                        if(goldcheck < 1) return msg.delete(),message.react("❎"),i.reply({content: `**Başarısız!** Biyografini değiştirmeye yeteri kadar altın bulunamadı.`, ephemeral: true}).catch(err => {});
                        msg.delete().catch(err => {})
                        message.channel.send({embeds: [new EmbedBuilder().setColor("Random").setAuthor({ name: `${message.member.user.username}`, iconURL: message.member.user.avatarURL({extension: "png"})}).setDescription(`Lütfen yeni bir biyografi belirleyiniz. En az 5 karakter en fazla 120 karakter olmak üzere.`)]}).then(mesaj => {
                            var filter = (m) => m.author.id == message.member.id
                            let collector = mesaj.channel.createMessageCollector({filter: filter, time: 60000, max: 1, errors: ["time"]})
                            collector.on('collect', async (m) => {
                                if(m.content == "iptal") return mesaj.delete(),message.react("❎"),m.reply({content: `İşlem istek üzerine iptal edildi.`, ephemeral: true}).catch(err => {});
                                let goldcheck = await client.Economy.bakiyeGöster(message.member.id, 0) || 0
                                if(goldcheck < 1) return mesaj.delete(),message.react("❎"),m.reply({content: `**Başarısız!** Biyografini değiştirmeye yeteri kadar altın bulunamadı.`, ephemeral: true}).catch(err => {});
                                if(m.content.length < 5 || m.content.length > 120) return mesaj.delete(),message.react("❎"),mreply({content: `**Başarısız!** Çok kısa veya çok uzun bir biyografi seçildi ve işlem iptal edildi.`, ephemeral: true}).catch(err => {});
                                mesaj.delete().catch(err => {})
                                message.react("✅").catch(err => {})
                                await Upstaff.updateOne({_id: message.member.id}, {$inc: {"Gold": -1}, $set: { "Biography": `${m.content}` }}, {upsert: true})
                                m.reply({content: `Başarıyla yeni biyografiniz \`${m.content}\` olarak belirlendi.`, ephemeral: true}).catch(err => {})
                            })
                        })
                    }
                })
            })

            return;
        }
        let gold = await client.Economy.bakiyeGöster(message.member.id, 0) || 0
        if(gold < 4) return message.reply({content: `**Başarısız!** Gereken **5 Altın** bulunamadığından satın alamazsın!`, ephemeral: true})
        let bio = args.splice(0).join(" ")
        if(!bio) return message.reply({content: `**Başarısız!** Bir biyografi belirlenmedi! (**En az**: \` 5 \`, **En fazla**: \` 120 \`)`, ephemeral: true})
        if(bio.length > 120) return message.reply({content: `**Başarısız!** Çok uzun bir biyografi mesajı! (**En az**: \` 5 \`, **En fazla**: \` 120 \`)`, ephemeral: true})
        if(bio.length < 5) return message.reply({content: `**Başarısız!** Çok kısa bir biyografi mesajı! (**En az**: \` 5 \`, **En fazla**: \` 120 \`)`, ephemeral: true})
        await Upstaff.updateOne({_id: message.member.id}, { $inc: {"Gold": -5}, $set: { "Biography": bio }}, {upsert: true})
        message.react("✅")
        message.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`Başarıyla **5 Altın** karşılığı biyografin \`${bio}\` olarak ayarlandı.`)]})
  }
};



function secretOluştur(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }