const Discord = module.require("discord.js")

module.exports.run = async(data) => {
    const me = data.client.users.cache.get(data.author);
    data.message.channel.send({ embeds: [{
        color: "#811ae8",
        author: {
          name: me.username,
          icon_url: me.displayAvatarURL()
        },
        title: "Source",
        url: "https://github.com/max-meme/bouncy-bot2",
        fields: [{
            name: "Good ol' tasty sauce",
            value: "The code to this bot is open source and can be found on github [here](https://github.com/max-meme/bouncy-bot2)"
          }
        ],
        footer: {
          text: "1001000 01101001"
        }
      }
    ]});
}

module.exports.help = {
	usage: "(prefix)source",
	category: "misc",
	func: "source"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	cmd: "source"
}