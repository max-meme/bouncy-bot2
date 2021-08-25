const Discord = module.require("discord.js")

module.exports.run = async(data) => {
	var m = data.message;
	var arg = data.args;
	var cmds = data.cmds;
	var mess = new Discord.MessageEmbed().setColor("#ffffff").setFooter("Options: < > = required, ( ) = optional");

	if(arg[0]) {
		for (i = 0; i < cmds.length; i++) {
			if(cmds[i].settings.cmd == arg[0] && cmds[i].settings.showonhelp) {
				gefunden = true;
				break;
			} 
		}
		if(!gefunden) return message.channel.send(`No command found called ${arg[0]}`);
		mess.setTitle(cmds[i].settings.cmd).addField(cmds[i].help.usage.replace("(prefix)", data.prefix), `Used to: ${cmds[i].help.func}`);
	}
	else {
		var cats = [];
		for (var i = 0; i < cmds.length; i++) {
			if(!cmds[i].settings.showonhelp) continue;
			var cat_found = false;
			for (var j = 0; j < cats.length; j++) {
				if(cmds[i].help.category == cats[j].name) {
					cats[j].cmds.push(cmds[i]);
					cat_found = true;
				}
			}

			if(!cat_found) {
				cats.push({
					name: cmds[i].help.category,
					cmds : [cmds[i]]
				})
			}
		}
		for (var i = 0; i < cats.length; i++) {
			var txt = "";
			for (var j = 0; j < cats[i].cmds.length; j++) {
				txt = txt + `\n${cats[i].cmds[j].help.usage.replace("(prefix)", data.prefix)}`
			}
			mess.addField(cats[i].name, txt);
		}
	}

	m.channel.send({ embeds: [mess] });
}

module.exports.help = {
	usage: "(prefix)help (command)",
	category: "misc",
	func: "list of all commands or help for a specific command when (command) is given"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	cmd: "help"
}