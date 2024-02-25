const { Client, Message, EmbedBuilder} = require("discord.js");
const moment = require("moment");

require("moment-duration-format");
require("moment-timezone");
const Beklet = new Set();

module.exports = {
    name: "slots",
    aliases: ["slot", "s"],
    kullanım: "slots <100-250000-all>",
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

    }
};

