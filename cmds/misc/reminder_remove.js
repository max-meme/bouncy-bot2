const Discord = module.require("discord.js")

module.exports.run = async(data) => {
    let found = false;
    let reminders = data.settings[data.message.guild.id].reminders;
    for (let i = reminders.length - 1; i >= 0; i--) {
        const reminder = reminders[i];
        if(reminder.text == data.args[0]) {
            reminders.splice(i, 1);
            data.message.channel.send(`Your reminder for \`${data.args[0]}\` has been removed`);
            found = true;
        }
    }
    if(!found) data.message.channel.send(`No reminder called \`${data.args[0]}\` was found`);
}

module.exports.help = {
	usage: "(prefix)reminder-remove <reminder>",
	category: "misc",
	func: "removes the given reminder"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	cmd: "reminder-remove",
	reqOptions: ["string"]
}