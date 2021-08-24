module.exports.run = async(data) => {
	var m = data.message;
	m.channel.send("Mioin");
}

module.exports.help = {
	usage: "~addquote <quote>",
	category: "quotes",
	func: "adds a quote"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: false,
	onjoin: false,
	neededperm: [],
	cmd: "moin"
}