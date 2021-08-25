const Discord = module.require("discord.js")

module.exports.run = async(data) => {
    data.message.channel.send(`This server has \`${data.message.member.guild.memberCount}\` mebers`);
}

module.exports.help = {
	usage: "(prefix)membercount",
	category: "misc",
	func: "counts the servers members"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	cmd: "membercount"
}