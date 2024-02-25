const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require('fs');
class economy extends Client {
    constructor (...options) {
        super({
            options,
            intents: [
              Object.keys(GatewayIntentBits)
            ],
        });
        this.config = global.config = require("./src/config");
        this.Economy = global.Economy = require("./src/classes/_index") || [];
        this.commands = new Collection();
        this.aliases = new Collection();
  }
  async fetchCommands() {
    let dirs = fs.readdirSync("./src/commands", { encoding: "utf8" });
    dirs.forEach(dir => {
        let files = fs.readdirSync(`./src/commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
       console.log(`${files.length} ADET KOMUT AKTİF EDİLDİ.`);
        files.forEach(file => {
            let cartel = require(`./src/commands/${dir}/${file}`);
            if(cartel.onLoad != undefined && typeof cartel.onLoad == "function") cartel.onLoad(this);
            this.commands.set(cartel.name, cartel);
            if (cartel.aliases) cartel.aliases.forEach(alias => this.aliases.set(alias, cartel));
        });
    });
  }
  async fetchEvents() {
    let dirs = fs.readdirSync('./src/events', { encoding: "utf8" });
    dirs.forEach(dir => {
        let files = fs.readdirSync(`./src/events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
        console.log(`${files} ADET EVENT AKTİF EDİLDİ.`);
        files.forEach(file => {
            let cartel = require(`./src/events/${dir}/${file}`);
            this.on(cartel.config.name, cartel);
        });
    });
 }

 _start(token) {
    this.login(token).then(() => {
        console.log(`${this.user.username} İSİMLİ BOT AKTİF EDİLDİ.`)
    }).catch(() => {
        console.log(`BOTA GİRİŞ YAPILAMADI.`)
    })
}
}

class mongoose {
    static async bağlan(options) {
        const active = options ? options.active : true;
        const url = options ? options.url : config.MONGOOSE;
        if(active) {
            const mongoose = require("mongoose");
            mongoose.set('strictQuery', true);
            try {
                await mongoose.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                setTimeout(() => {
                    console.log(`BOT VERİTABANINA BAĞLANDI.`);
                }, 3000);
            } catch (err) {
                console.log(`BOT VERİTABANINA BAĞLANAMADI. ${err}`);
                process.exit();
            }
        }
    }
}

module.exports = { economy, mongoose}