const Discord = require('discord.js');
const mc = require('minecraft-ping');
const servers = require('../servers.json');

const list = new Discord.Collection();
for (i in servers) {
    list.set(servers[i].label, servers[i]);
}

module.exports = {
    name: 'status',
    description: 'Check the status of our servers',
    aliases: ['ss', 'servers'],
    execute(message, args) {
        richembed = new Discord.RichEmbed()
            .setColor("#77b255")
            .setTimestamp();
        if (!args.length) {
            var serverCount = 0;
            for (i in servers) {
                getStatus(servers[i].port, servers[i].label)
                    .then(function () {
                        serverCount++;
                        richembed.addField(title, status);

                        if (serverCount == Object.keys(servers).length) {
                            // console.log(embed);
                            return message.channel.send("", { embed: richembed });
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        return;
                    });
            }
        } else if (args[0] === "list") {
            const avServers = [];
            for (i in servers) {
                avServers.push(servers[i].label);
            }
            return message.channel.send("Available Servers: " + avServers.join(", "));
        } else {
            const server = list.find(server => server.label.toLowerCase() && server.label.toLowerCase().includes(args[0].toLowerCase()))
            if (!server) return message.channel.send("Invalid server!");
            getStatus(server.port, server.label)
                .then(function () {
                    richembed.addField(title, status);
                    return message.channel.send("", { embed: richembed });
                })
                .catch((err) => {
                    console.error(err);
                    return;
                });

        }
    },
};

function getStatus(port, label) {
    return new Promise(function (resolve, reject) {
        var playerList = "";
        mc.ping_fefd_udp({ host: 'localhost', port: port }, function (err, response) {
            if (err) {
                // console.log('ping error', err);
                reply = title = label + " Status :x:",
                    status = "Server is offline..";
                resolve();
            } else {
                // console.log('gotit', response);
                if (response.players.length > 0) {
                    for (i in response.players) {
                        if (i < response.players.length - 1) {
                            playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_") + ", ";
                        } else {
                            playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_");
                        }
                    }
                }
                reply = title = label + " Status :white_check_mark:",
                    status = "Pack Version: " + response.motd.replace(/§[\d|A-Z]/g, "") + "\nPlayers online (" + response.numPlayers + "/" + response.maxPlayers + ") " + playerList;
                resolve();
            }
        });
    });
}