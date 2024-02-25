const { Client, Message, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, StringSelectMenuBuilder, PermissionFlagsBits, StringSelectMenuOptionBuilder} = require("discord.js");
const Canvas = require('canvas')
const Shops = require("../../database/mağaza")
Canvas.registerFont(`./src/classes/fonts/theboldfont.ttf`, { family: "Bold" });
Canvas.registerFont(`./src/classes/fonts/SketchMatch.ttf`, { family: "SketchMatch" });
Canvas.registerFont(`./src/classes/fonts/LuckiestGuy-Regular.ttf`, { family: "luckiest guy" });
Canvas.registerFont(`./src/classes/fonts/KeepCalm-Medium.ttf`, { family: "KeepCalm" });
const Users = require('../../database/User');


module.exports = {
    name: "mağaza",
    aliases: ["shop","mağza","market","coinmarket"],
    kullanım: "mağaza @cartel/ID",
    açıklama: "Bir üyenin coin bilgisini görüntüler.",
    
    
    
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
        let embed = new EmbedBuilder().setColor("Random")
        let para = await client.Economy.bakiyeGöster(message.member.id, 1)
        let altın = await client.Economy.bakiyeGöster(message.member.id, 0)
        let canvas = Canvas.createCanvas(1080, 300),
        ctx = canvas.getContext("2d");
    
    // Canvas
    ctx.beginPath();
    ctx.moveTo(0 + Number(30), 0);
    ctx.lineTo(0 + 1080 - Number(30), 0);
    ctx.quadraticCurveTo(0 + 1080, 0, 0 + 1080, 0 + Number(30));
    ctx.lineTo(0 + 1080, 0 + 300 - Number(30));
    ctx.quadraticCurveTo(
        0 + 1080,
        0 + 300,
        0 + 1080 - Number(30),
        0 + 300
    );
    ctx.lineTo(0 + Number(30), 0 + 300);
    ctx.quadraticCurveTo(0, 0 + 300, 0, 0 + 300 - Number(30));
    ctx.lineTo(0, 0 + Number(30));
    ctx.quadraticCurveTo(0, 0, 0 + Number(30), 0);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1080, 300);
    
    let background = await Canvas.loadImage(client.guilds.cache.get(config.SERVER).banner ? client.guilds.cache.get(config.SERVER).banner ? client.guilds.cache.get(config.SERVER).bannerURL({extension: "png"}) + `?size=4096` : "https://cdn.discordapp.com/attachments/946751524028162118/947678638315298866/open-the-door-android-iphone-desktop-hd-backgrounds-wallpapers-1080p-4khd-wallpapers-desktop-background-android-iphone-1080p-4k-pqrfj.png" : "https://cdn.discordapp.com/attachments/946751524028162118/947678638315298866/open-the-door-android-iphone-desktop-hd-backgrounds-wallpapers-1080p-4khd-wallpapers-desktop-background-android-iphone-1080p-4k-pqrfj.png");
    ctx.drawImage(background, 0, 0, 1080, 300);
    
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(50, 30, 980, 250);
    ctx.globalAlpha = 1;
    
    // Draw title
    ctx.font = "140px Bold";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 8;
    ctx.strokeText(`URUN LISTESI`, 50, canvas.height - 100);
    ctx.fillStyle = "#e7d02e";
    ctx.fillText(`URUN LISTESI`, 50, canvas.height - 100);
    let ürünlercik = await Shops.find();

    let arrayItems = []; // Bu diziyi tanımlamayı unutmayın
    
    ürünlercik.forEach(data => {
      arrayItems.push(new StringSelectMenuOptionBuilder()
        .setLabel(`${data.name} ( ${data.role ? `Rol: ${message.guild.roles.cache.get(data.roleID).name}` : data.desc} )`)
        .setDescription(`${data.coin > 0 ? data.coin.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ` ${config.SERVER_NAME} Parası${data.gold > 0? " ve" : ""}` : ``} ${data.gold > 0 ? data.gold + ` Altın` : ``}${data.gold <= 0 && data.coin <= 0 ? `Ücretsiz Ürün` : ``}`)
        .setValue(data.name)
      );
    });
    
    let ürünlistesiii = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`ürüncükal`)
        .setPlaceholder('Ürünlerimizi listelemek için tıklayın.')
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(
          arrayItems.length > 0 ? arrayItems : new StringSelectMenuOptionBuilder()
            .setLabel("Kapalı Mağaza")
            .setDescription("Mağazamız kapalıdır!")
            .setValue("1233223423")
        ),
    );
    

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'cartel_economy.png'});


        if(message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            if(args[0] == "sil") {
                if(!args[1]) return message.reply("Ürün ismi girmediğin için iptal edildi.").then(x => {
                    setTimeout(() => {
                        x.delete()
                    }, 7500);
                    message.react("❎")
                });
                let ürünBul = await Shops.findOne({name: args[1]})
                if(!ürünBul) return message.reply("Ürün bulunamadığından iptal edildi.").then(x => {
                    setTimeout(() => {
                        x.delete()
                    }, 7500);
                    message.react("❎")
                });
                await Shops.deleteOne({name: args[1]}) 
                message.react("✅").catch(err => {})
                return;
            }
            if(args[0] == "ekle" || args[0] == "güncelle") {
                let isim = args[1]
                 if(!isim) return message.reply("Lütfen bir ürün ismi giriniz.").then(x => {
                     setTimeout(() => {
                         x.delete()
                     }, 7500);
                     message.react("❎")
                 });
                let coin = args[2]
                if(!coin) return message.reply(`Lütfen ${config.SERVER_NAME.toLowerCase()} parası belirleyin. **0 yaparsanız otomatik olarak ücretsiz yapacaktır!**`).then(x => {
                    setTimeout(() => {
                        x.delete()
                    }, 7500);
                    message.react("❎")
                });
                let gold = args[3]
                if(!gold) return message.reply(`Lütfen altın belirleyin. **0 yaparsanız otomatik olarak ücretsiz yapacaktır!**`).then(x => {
                    setTimeout(() => {
                        x.delete()
                    }, 7500);
                    message.react("❎")
                });
                let emoji = args[4]
                if(!emoji) return message.reply(`Lütfen bir emoji belirleyin belirlemek istemiyorsanız **yok** yazın.`).then(x => {
                    setTimeout(() => {
                        x.delete()
                    }, 7500);
                    message.react("❎")
                });
                let desc = args.splice(5).join(" ");
                if(!desc) return message.reply(`Lütfen bir açıklama girin.`).then(x => {
                    setTimeout(() => {
                        x.delete()
                    }, 7500);
                    message.react("❎")
                });
                let role = message.mentions.roles.first()
                if(role) {
                    await Shops.updateOne({name: isim}, {desc: desc, emoji: emoji, gold: gold, coin: coin, role: true, roleID: role.id}, {upsert: true})
                } else {
                    await Shops.updateOne({name: isim}, {desc: desc, emoji: emoji, gold: gold, coin: coin}, {upsert: true})
                }
                message.react("✅")
                return;
            }
        } 
        let msg = await message.channel.send({content: `:tada: **${config.SERVER_NAME} Mağazasına Hoşgeldiniz!** ${arrayItems.length > 0 ? "Aşağıda listelenmekte olan ürünlerimizden, almak istediğiniz ürünü seçebilirsiniz." : "Şuan da ürün bulunamadığından mağazamız kapalıdır!"}`,components: [ürünlistesiii], files: [attachment]})

        const filter = i => i.user.id == message.member.id 
        const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], time: 30000 })
        collector.on("end", c => {
            msg.delete().catch(err => {})
        })
        collector.on('collect', async i => { 
            if(i.customId == "ürüncükal") { 
                let ürünBilgisi = await Shops.findOne({name: i.values})
                if(!ürünBilgisi) return i.reply({content: `**Başarısız!** böyle bir ürün bulunamadı, lütfen ürünü seçin!`, ephemeral: true});
                let isim = ürünBilgisi.name
                let tip = ürünBilgisi.type
                let coin = ürünBilgisi.coin
                let gold = ürünBilgisi.gold
                let emoji = ürünBilgisi.emoji  
                let uye = message.guild.members.cache.get(i.user.id)
                if(coin > 0 && para < coin) return i.reply({content: `**Başarısız!** Gereken ${coin} ${config.SERVER_NAME} Parası bulunamadığından satın alamazsın!`, ephemeral: true});
                if(gold > 0 && altın < gold) return i.reply({content: `**Başarısız!** Gereken ${gold} Altın bulunamadığından satın alamazsın!`, ephemeral: true});
                let dattaaa = await Users.findOne({_id: uye.id})
                if(dattaaa && dattaaa.Inventory) {
                    let ürünlerrrrr = []
                    dattaaa.Inventory.forEach(x => {
                        ürünlerrrrr.push(x.Name)
                    })
                    if(ürünlerrrrr.includes(isim)) return msg.delete().catch(err => {}),i.reply({content: `**Başarısız!** \`${isim}\` isimli ürün envanterinde bulunduğundan dolayı tekrardan satın alamazsın.`, ephemeral: true}),message.react("❎").catch(err => {})
                }
                if(coin > 0) {
                    await client.Economy.bakiyeGüncelle(uye.id, coin, "remove", 1)
                } 
                if(gold > 0) {
                    await client.Economy.bakiyeGüncelle(uye.id, gold, "remove", 0)
                }
                if(ürünBilgisi.role) {
                    uye.roles.add(ürünBilgisi.roleID).catch(err => {})
                } 
                let alınanÜrün = {
                    Name: isim,
                    Coin: coin,
                    Type: tip,
                    Gold: gold,
                    Tarih: Date.now()
                }
                if(tip == "badge") Users.updateOne({_id: uye.id}, {$push: { "Badges": {Name: isim, Emoji: emoji}}}, {upsert: true})
                await Users.updateOne({_id: uye.id}, {$push: { "Inventory": alınanÜrün}}, {upsert: true})
                msg.delete().catch(err => {})
                let kanalBul = message.guild.channels.cache.get(config.CHANNELS.mağazaLog)
                if(kanalBul) kanalBul.send({embeds: [new EmbedBuilder().setColor("Random")
                .setDescription(`:tada: ${message.member} isimli üye tarafından **${alınanÜrün.Name}** isimli ürün \`${tarihsel(Date.now())}\` tarihinde satın alındı.`)
                ]})
                i.reply({embeds: [new EmbedBuilder().setColor("Random").setDescription(`Başarıyla **${isim}** isimli ürünü <t:${String(Date.now()).slice(0, 10)}:R> satın aldınız.`)], ephemeral: true})
                message.react("✅").catch(err => {})


            }

        })

    }
};


function applyText(canvas, text, defaultFontSize, width, font){
    const ctx = canvas.getContext("2d");
    do {
        ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
    } while (ctx.measureText(text).width > width);
    return ctx.font;
}