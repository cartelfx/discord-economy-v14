const mongoose = require("mongoose");

const schema = mongoose.model('Economy', new mongoose.Schema({
    _id: String,
    Biography: String,
    Badges: { type: Object },
    Coin: { type: Number, default: 250, min: 0 },
    Gold: { type: Number, default: 1, min: 0 },
    Daily: { type: Number, default: 0 },
    Transfers: { type: Object },
    Inventory: { type: Object },
}));

module.exports = schema;