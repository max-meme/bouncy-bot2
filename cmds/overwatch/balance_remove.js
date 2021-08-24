const Discord = module.require("discord.js")

module.exports.run = async function run(data) {
    var players = [...data.settings[data.message.guildId].player_cache];
    var found = false;
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if(player.name == data.args[0]) {
            found = true;
            data.settings[data.message.guildId].player_cache.splice(i, 1);
        }
    }
    if(found) data.message.channel.send(`Player \`${data.args[0]}\` has been removed`);
    else data.message.channel.send(`Player \`${data.args[0]}\` was not found`);
}

module.exports.help = {
	usage: `(prefix)balance-remove`,
	category: "overwatch",
	func: "removes given player"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	onjoin: false,
	neededperm: [],
	cmd: "balance-remove",
    req_args: 1
}