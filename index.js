const { economy, mongoose} = require("./botClient");
const client = global.client = new economy();

client._start(config.ECONOMY);
mongoose.bağlan({
    active: true,
    url: client.config.MONGOOSE
})
client.fetchCommands();
client.fetchEvents();