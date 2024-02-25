const { Client, Message, EmbedBuilder} = require("discord.js");

const Coins = require('../../database/User');
module.exports = {
    name: "removebalance",
    aliases: ["balremove","bal-remove","ballrev","coinsil"],
    kullanım: "removebalance <Altın/Para> <@cartel/ID> <Miktar>",
    açıklama: "",
    
    
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String|Number>} args
   * @returns {Promise<void>}
   */

  execute: async function (client, message, args) {
    let embed = new EmbedBuilder().setColor("Random")
    let uye = message.guild.members.cache.get(message.member.id);
    let Coin = 0
    if(!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;
    if(!args[0]) return message.reply(`Lütfen hangi birimden geri alacağını belirt. (Örn: \`${config.PREFİXS[0]}removebalance <Altın/Para> <@cartel/ID> <Miktar>\` )`).then(x => {
        message.react("❎")
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
    if(args[0] == "Para" || args[0] == "para") {
        Coin = await client.Economy.bakiyeGöster(uye.id, 1)
        let Gönderilen = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if(!Gönderilen) return message.reply(`Geri almak istediğiniz bi üyeyi belirtin.`)
        let Miktar = Number(args[2]);
        if(isNaN(Miktar)) return message.reply(`Geri almak istediğiniz miktarı rakam olarak girin.`)
        Miktar = Miktar.toFixed(0);
        if(Miktar <= 0) return message.reply(`Geri alınacak rakam birden küçük veya sıfır olamaz.`)
        await client.Economy.bakiyeGüncelle(Gönderilen.id, Miktar, "remove", 1)
        await Coins.updateOne({_id: Gönderilen.id}, { $push: { "Transfers": { Uye: uye.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Havadan Giden Para" } }}, {upsert: true})
        await message.react("✅")
        await message.channel.send({embeds: [embed.setDescription(`${Gönderilen} üyesine başarıyla \`${Miktar}\` ${config.SERVER_NAME} Parasını geri aldın.`)]})
        return;
    } else if(args[0] == "Altın" || args[0] == "altın") {
        Coin = await client.Economy.bakiyeGöster(uye.id, 0)
        let Gönderilen = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if(!Gönderilen) return message.reply(`Geri almak istediğiniz bi üyeyi belirtin.`)
        let Miktar = Number(args[2]);
        if(isNaN(Miktar)) return message.reply(`Geri almak istediğiniz miktarı rakam olarak girin.`)
        Miktar = Miktar.toFixed(0);
        if(Miktar <= 0) return message.reply(`Geri alınacak rakam birden küçük veya sıfır olamaz.`)
        await client.Economy.bakiyeGüncelle(Gönderilen.id, Miktar, "remove", 0)
        await Coins.updateOne({_id: Gönderilen.id}, { $push: { "Transfers": { Uye: uye.id, Tutar: Miktar, Tarih: Date.now(), Islem: "Havadan Giden Altın" } }}, {upsert: true})
        await message.react("✅")
        await message.channel.send({embeds: [embed.setDescription(`${Gönderilen} üyesine başarıyla \`${Miktar}\` geri aldın.`)]})
        return;
    
    }
    return message.reply(`Lütfen hangi birimden geri alacağını belirt. (Örn: \`${config.PREFİXS[0]}removebalance <Altın/Para> <@cartel/ID> <Miktar>\` )`).then(x => {
        message.react("❎")
        setTimeout(() => {
            x.delete()
        }, 7500);
    });
  }
};