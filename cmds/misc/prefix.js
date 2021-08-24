module.exports.run = async(data) => {
    var m = data.message;
	var arg = data.args;
	if(!arg[0]) {
		m.channel.send(`The current prefix is ${data.settings[m.guild.id].prefix}`);
		return;
	}
	data.settings[m.guild.id].prefix = arg[0];
	m.channel.send(`The prefix has been changed to **${arg[0]}**`)
}

module.exports.help = {
	usage: "(prefix)prefix (new prefix)",
	category: "misc",
	func: `Changes the prefix of this server used for this bot. When no argument given this sends the current prefix. Note that the prefix \`b!\` will always work, no matter what this servers custom prefix is.`
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	onjoin: false,
	neededperm: ["ADMINISTRATOR"],
	cmd: "prefix"
}