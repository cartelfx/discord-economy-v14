const { Client, Message, EmbedBuilder} = require("discord.js");

const Coins = require('../../database/User');

module.exports = {
    name: "zenginler",
    aliases: ["topcoin","top-coin","zenginlistesi"],
    kullanım: "topcoin",
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
    let Zenginler = []
    let data = await Coins.find()
    data.map(x => {
        Zenginler.push({
          _id: x._id,
          Gold: x.Gold,
          Coin: x.Coin
        })
    })
    message.reply({embeds: [embed.setDescription(`Aşağıda ki sıralama altın ve para bazından **30** üye aşağıda listelenmektedir.

${Zenginler.sort((a,b) => {
      return Number((b.Gold * client.dovizAltın) + b.Coin) - Number((a.Gold * client.dovizAltın) + a.Coin)
    }).filter(x => message.guild.members.cache.get(x._id) && !message.guild.members.cache.get(x._id).user.bot).slice(0, 30).map((x, index) => `\` ${index+1} \` ${x._id ? message.guild.members.cache.get(x._id) : `<@${x._id}>`} \` ${x.Coin.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} \` | \` ${x.Gold} \` ${x._id == message.member.id ? `**(Siz)**` : ``}`).join("\n")}`)]}).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 20000);
    })
   }
};