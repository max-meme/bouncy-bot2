const Discord = require("discord.js");
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INVITES", "GUILD_MESSAGE_REACTIONS", "GUILD_PRESENCES", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "DIRECT_MESSAGES", "DIRECT_MESSAGE_TYPING"], partials: ["CHANNEL"]});
const fs = require("fs");

const version = "2.0"

//load files
var creds = JSON.parse(fs.readFileSync('./creds.json', 'utf-8'));
var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

client.login(creds.discord_token);

var cmds = readcmds();
let defaultprefix = "b!"

TimerCheck();

client.on("messageCreate", async message => {
	if(message.author.bot) return;

	var guild = message.guild;	
	var prefix = defaultprefix;
	if(guild) {
		if (!settings[guild.id]) {
			settings[guild.id] = {
				prefix: defaultprefix,
				player_cache: [],
				reminders: []
			}
			updatedata();
		}
		if (settings[guild.id].prefix && !message.content.startsWith(prefix)) prefix = settings[guild.id].prefix;
	}
	
	let messageArray = message.content.toLowerCase().split(/\s+/g);
	let command = messageArray[0].slice(prefix.length);
	let args = messageArray.slice(1);
	
	var runData = {
		client: client,
		message: message,
		command: command,
		args: args,
		settings: settings,
		cmds: cmds,
		defaultprefix: defaultprefix,
		prefix: prefix,
		author: creds.author
	}

	//callt alle funktionen die bei jeder message gecallt werden müssen oder die die ausgefürt werden sollen
	for (var i = 0; i < cmds.length; i++) {
		if(message.channel.type == "dm" && cmds[i].settings.ondm) {
			cmds[i].run(runData);
		}
		else if(cmds[i].settings.onallmessages && !(message.channel.type == "dm")) {
			cmds[i].run(runData);
		}
		if (command && !(message.channel.type == "dm")) {
			if(messageArray[0].startsWith(prefix) && command == cmds[i].settings.cmd) {
				var haspermission = true;
				var missingperm = [];
				if(cmds[i].settings.neededperm) {
					cmds[i].settings.neededperm.forEach(element => {
						if(!message.member.permissions.has(element)){
							 haspermission = false;
							 missingperm.push(element);
						}
					});
				}
				
				if(haspermission) {
					await cmds[i].run(runData);
					updatedata();
				}
				else {
					message.channel.send(`You are missing the permission \`${missingperm}\` to run this command`);
				}
			}
		}
	}
});

client.on('error', console.error);

client.on("ready", () => {
  console.log(`Bouncy-bot version ${version} is online!`);
  client.user.setActivity(`${defaultprefix}help for bouncy Help | Bouncy is currently in beta | version ${version}`);
})


client.on("guildMemberAdd", async member => {
	for (var i = 0; i < cmds.length; i++) {
		if(cmds[i].settings.onjoin) {
			var data = {
				member: member,
				settings: settings
			}
			await cmds[i].run(data);
			updatedata();
		}
	}
})

client.on("messageReactionAdd", async (reaction, user) => {
	for (var i = 0; i < cmds.length; i++) {
		if(cmds[i].settings.onreact) {
			var data = {
				user: user,
				reaction: reaction,
				settings: settings
			}
			await cmds[i].run(data);
			updatedata();
		}
	}
})


// liest zuerst die ordner aus cmds und dann die dateien in diesen ordnern und required sie
function readcmds() {
	var folders = readfolder("./cmds/");
	var cmds = [];

	for (var i = 0; i < folders.length; i++) {
		console.log("\n" + folders[i]);
		var cmdfolders = readfolder("./cmds/" + folders[i]);
		for(var j = 0; j < cmdfolders.length; j++) {
			console.log(`      loading ${cmdfolders[j]}`);
			cmds.push(require(`./cmds/${folders[i]}/${cmdfolders[j]}`));
		}
	}
	return cmds;
}


function readfolder(folder) {
	return fs.readdirSync(folder);
}

const getCircularReplacer = () => {
	const seen = new WeakSet();
	return (key, value) => {
	  if (typeof value === "object" && value !== null) {
		if (seen.has(value)) {
		  return;
		}
		seen.add(value);
	  }
	  return value;
	};
};

function updatedata() {
  var data = JSON.stringify(settings, getCircularReplacer());
  fs.writeFile("settings.json", data, function(err) {
    if(err) {
        console.log(err)
    }
  });
  console.log("data saved!");
}

function TimerCheck() {
	setInterval(function() {
		for(x in settings) {
			for (let i = settings[x].reminders.length - 1; i >= 0; i--) {
				const reminder = settings[x].reminders[i];
				if(reminder.remind <= Date.now()) {
					client.users.cache.get(reminder.user).send(`Here is your reminder for \`${reminder.text}\``);
					if(!reminder.repeat) settings[x].reminders.splice(i, 1);
					else reminder.remind = Date.now() + reminder.addTime;
				}
			}
		};
	}, 1000)
}