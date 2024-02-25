const { Client, Message, EmbedBuilder} = require("discord.js");

const Coins = require('../../database/User');
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");
module.exports = {
    name: "günlük",
    aliases: ["günlükcoin","maaş","daily"],
    kullanım: "günlük",
    açıklama: "24 Saatte bir belirli bir coin ödülü alırsınız.",
    
    
    
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
    let Hesap = await Coins.findById({_id: uye.id}) 
        if(Hesap && Hesap.Daily) {
            let yeniGün = Hesap.Daily + (1*24*60*60*1000);
            if (Date.now() < yeniGün) {
                message.react("❎")
                return message.reply(`Tekrardan günlük ödül alabilmen için **${moment.duration((yeniGün - Date.now())).format('H [Saat,] m [Dakika,] s [Saniye]')}** beklemen gerekiyor.`).then(x => {
setTimeout(() => {x.delete()}, 7500)
})
            }
        }
    let Günlük = Math.random();
    Günlük = Günlük*(5000-100);
    Günlük = Math.floor(Günlük)+100
    await Coins.updateOne({ _id: uye.id }, { $set: { "Daily": Date.now() }, $inc: { "Coin": Günlük } }, {upsert: true})
    await message.react("✅")
    await message.reply({content: `**Başarıyla günlük ödül aldınız!**
Alınan günlük ödülünüz: \`${Günlük.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ${config.SERVER_NAME} Parası\``})
.then(mesaj => {
    setTimeout(() => {
        mesaj.delete()
    }, 12500);
})
   }
};