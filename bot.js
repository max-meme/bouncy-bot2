const Discord = require("discord.js");
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INVITES", "GUILD_MESSAGE_REACTIONS", "GUILD_PRESENCES", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "DIRECT_MESSAGES", "DIRECT_MESSAGE_TYPING"], partials: ["CHANNEL"]});
const fs = require("fs");

//load files
var creds = JSON.parse(fs.readFileSync('./creds.json', 'utf-8'));
var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

client.login(creds.discord_token);

var cmds = readcmds();
let defaultprefix = "b!"

client.on("messageCreate", async message => {
	if(message.author.bot) return;

	var guild = message.guild;	
	var prefix = defaultprefix;
	if(guild) {
		if (!settings[guild.id]) {
			settings[guild.id] = {
				prefix: defaultprefix,
				player_cache: []
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
		prefix: prefix
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
					message.channel.send(`Es wird die Permission **${missingperm}** gebraucht um diesen Command auszuführen`);
				}
			}
		}
	}
});

client.on('error', console.error);

client.on("ready", () => {
  console.log("Bouncy bot 2 is online!");
  client.user.setActivity(`${defaultprefix}help for bouncy Help | Bouncy is currently in beta`);
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

client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
});



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