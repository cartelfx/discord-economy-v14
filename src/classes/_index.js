const Users = require('../database/User');

class Coin {
    static async bakiyeGüncelle(id, balance = "10", process = "add", type = 1) {
        let uye = client.guilds.cache.get(config.SERVER).members.cache.get(id);
        if(!uye) return 0;
        let account = await Users.findOne({_id: uye.id})
        if(!account) return 0;
        let gold = account ? account.Gold ? account.Gold : 0 : 0
        let coin = account ? account.Coin ? account.Coin : 0 : 0
        
        switch (type) {
            case 0: {
                if(process == "remove") {
                    if(account && gold-1 >= 0) return await Users.updateOne({_id: uye.id}, {$inc: {"Gold": -balance}}, {upsert: true});
                } else if(process == "add") return await Users.updateOne({_id: uye.id}, {$inc: {"Gold": balance}}, {upsert: true})
            };
            case 1: {
                if(process == "remove") {
                    if(account && coin-1 >= 0) return Users.updateOne({_id: uye.id}, {$inc: {"Coin": -balance}}, {upsert: true});
                } else if(process == "add") return await Users.updateOne({_id: uye.id}, {$inc: {"Coin": balance}}, {upsert: true})
            };
            default: throw new TypeError(`${balance} miktarında ${type == 0 ? "altın" : "jeton" } ${process == "add" ? "eklenemedi" : "azaltılamadı"}`);
        }
    }

    static async bakiyeGöster(id, type = 2) {
        let uye = client.guilds.cache.get(config.SERVER).members.cache.get(id);
        if(!uye) return 0;
        let account = await Users.findOne({_id: uye.id})
        if(!account) return 0;
        let gold = account ? account.Gold ? account.Gold : 0 : 0
        let coin = account ? account.Coin ? account.Coin : 0 : 0
        
        switch (type) {
            case 0: return Number(gold);
            case 1: return Number(coin);
            case 2: return {
                Gold: Number(gold),
                Coin: Number(coin)
            }
            default: throw new TypeError("Para tipi girilmedi.");
        }
    }
}

module.exports = Coin