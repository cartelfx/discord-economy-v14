const { Client, Message } = Discord = require("discord.js");
module.exports = {
    name: "düello",
    aliases: ["vs","duello","kapış"],
    kullanım: "düello <@cartel/ID> <Miktar>",
    açıklama: "24 Saatte bir belirli bir coin ödülü alırsınız.",
    
    
    
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
     
}
};