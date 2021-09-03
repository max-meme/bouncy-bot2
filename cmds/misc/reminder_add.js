const Discord = module.require("discord.js")

module.exports.run = async(data) => {
	let reminders = data.settings[data.message.guild.id].reminders;
	let args = data.args;
	let repeat = false;

	if(isNaN(args[1]) || isNaN(args[2]) || isNaN(args[3])) return data.message.channel.send("hour, minute and second need to be numbers");
	if(args[4] == "true" || args[4] == "yes") repeat = true;

	let addTime = args[1] * 60 * 60 * 1000 + args[2] * 60 * 1000 + args[3] * 1000;
	let remindTime = Date.now() + addTime;
	reminders.push({
		user: data.message.author.id,
		remind: remindTime,
		repeat: repeat,
		text: args[0],
		addTime: addTime
	})
	data.message.channel.send(`you will be reminded for \`${args[0]}\` on \`${new Date(remindTime).toUTCString()}\``);
}

module.exports.help = {
	usage: "(prefix)reminder-add <reminder> <hour> <minute> <second> (repeat)",
	category: "misc",
	func: "reminds you"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	cmd: "reminder-add",
	reqOptions: ["string", "int", "int", "int"]
}