const Discord = module.require("discord.js")

module.exports.run = async function run(data) {
    data.settings[data.message.guildId].player_cache = [];
    data.message.channel.send(`Player list has been cleared`)
}

module.exports.help = {
	usage: `(prefix)balance-clear`,
	category: "overwatch",
	func: "clears the player list to be used in the balance command"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	onjoin: false,
	neededperm: [],
	cmd: "balance-clear",
    req_args: 0
}