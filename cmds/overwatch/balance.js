//TODO: unranked players and say if ppl have been removed
const Discord = module.require("discord.js")

module.exports.run = async function run(data) {
    var players = [...data.settings[data.message.guildId].player_cache];
    var team1 = [];
    var team2 = [];
    var removed = null;
    var unraked_players = [];

    //remove a random player if the team size is odd
    if(players.length % 2 == 1) {
        rn = Math.floor(Math.random() * players.length)
        players.splice(rn, 1)
    }

    //remove random players so that there are no more than 12
    while(players.length > 12) {
        rn = Math.floor(Math.random() * players.length)
        players.splice(rn, 1)
    }

    //filter out unranked players
    for (let i = players.length - 1; i >= 0; i--) {
        const player = players[i];
        if(player.unraked) {
            unraked_players.push(player);
            players.splice(i, 1);
        }
    }

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if(i % 2 == 0) team1.push(player);
        else team2.push(player);
    }

    var change = true;
    while(change) {
        change = false;
        for (let i = 0; i < team1.length; i++) {
            const player1 = team1[i];
            for (let j = 0; j < team2.length; j++) {
                const player2 = team2[j];
                
                let testTeam1 = [...team1];
                let testTeam2 = [...team2];
                testTeam1[i] = team2[j];
                testTeam2[j] = team1[i];

                //check if the sr difference between the teams got smaller
                if(Math.abs(calcTeamSR(team1) - calcTeamSR(team2)) > Math.abs(calcTeamSR(testTeam1) - calcTeamSR(testTeam2))) {
                    change = true;
                    team1 = testTeam1;
                    team2 = testTeam2;
                }
            }
        }
    }

    let text = `**Team 1** with an average SR of ${Math.round(calcTeamSR(team1) / 2)} a total SR of ${calcTeamSR(team1)}\n`
    team1.forEach(player => {
        text = text + `${player.name} | ${player.sr} \n`;
    });
    text = text + `\n**Team 2** with an average SR of ${Math.round(calcTeamSR(team2) / 2)} a total SR of ${calcTeamSR(team2)}\n`
    team2.forEach(player => {
        text = text + `${player.name} | ${player.sr} \n`;
    });
    data.message.channel.send(text);

    function calcTeamSR(team) {
        var sr = 0;
        team.forEach(player => {
            sr = sr + player.sr;
        });
        return sr;
    }
}

module.exports.help = {
	usage: `(prefix)balance`,
	category: "overwatch",
	func: "creates a balanced team out of the available players \n if the amount of players is uneven, one player will be removed"
}

module.exports.settings = {
	onallmessages: false,
	showonhelp: true,
	onjoin: false,
	neededperm: [],
	cmd: "balance",
    req_args: 0
}