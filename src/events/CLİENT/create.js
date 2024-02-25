const { Message, ChannelType } = require("discord.js");

 /**
 * @param {Message} message 
 */

module.exports = async (message) => { 
      if (!global.config.PREFİXS.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == ChannelType.DM) return;
    let args = message.content.substring(global.config.PREFİXS.some(x => x.length)).split(" ");
    let komutcuklar = args[0].toLocaleLowerCase();
    let cartel = message.client;
    args = args.splice(1);
    let calistirici;
    
    if(cartel.commands.has(komutcuklar) || cartel.aliases.has(komutcuklar)) {
          calistirici = cartel.commands.get(komutcuklar) || cartel.aliases.get(komutcuklar);
          if(calistirici) calistirici.execute(cartel, message, args);
    } 

};

module.exports.config = {
    name: "messageCreate"
};