const Discord = module.require("discord.js")

module.exports.run = async function run(data) {
    var args = data.args;
    var message = data.message;
    var name_input = args[0];
    var SR_input = args[1];

    var unranked = false
    var SR = 0

    //check if sr is number and between 1 and 5000
    if(SR_input == "unranked") unranked = true
    else {
        if(isNaN(SR_input)) return message.channel.send("SR option is not a number or \`unranked\`")
        SR = parseInt(SR_input)
        if(5000 < SR || SR < 1) return message.channel.send("SR needs to be between 1 and 5000 or \`unranked\`")
    }
    data.settings[message.guildId].player_cache.push({name: name_input, sr: SR, unranked: unranked})
    data.updatedata();
    message.channel.send(`Player \`${name_input}\` has been added`)
}

module.exports.help = {
	usage: `(prefix)balance-add <player-name> <sr>`,
	category: "overwatch",
	func: "adds a player to be used in the balance command"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	onjoin: false,
	neededperm: [],
	cmd: "balance-add",
    req_args: 2
}