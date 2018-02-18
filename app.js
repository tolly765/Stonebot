const mc = require('minecraft-ping');
const Discord = require('discord.js');
const client = new Discord.Client();

client.login('tokenhere');

var command = '!serverstatus';
var servers = {
    "server1" : {
        "label" : "server1 name",
        "port" : "25565"
    },
    "server2" : {
        "label" : "server2 bane",
        "port" : "25566"
    },
};

client.on('message', message => {
    if (message.channel.name != "serverchat" && message.content.startsWith(command)) {
        richembed = new Discord.RichEmbed()
                .setColor("#77b255")
                .setTimestamp();

        //remove author command invoke message (requires channel permission "MANAGE_MESSAGES")
        if (message.channel.type == "text") {
            message.delete().catch(err => console.error(err));
        }

        var serverCount = 0;
        for (i in servers){
            getStatus(servers[i].port, servers[i].label)
                .then(function() {
                    serverCount++;
                    richembed.addField(title, status);

                    if(serverCount == Object.keys(servers).length){
                      // console.log(embed);
                      message.reply("", {embed: richembed});
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }
});

function getStatus(port, label) {
    return new Promise(function(resolve, reject) {  
        var playerList = "";
        mc.ping_fefd_udp({host: 'localhost', port: port}, function(err, response) {
            if (err) {
                reply = title = label + " Server Status :x:",
                        status = "Server is offline..";
                resolve();
            } else {
                if (response.players.length > 0){
                    for (i in response.players){
                        if (i < response.players.length - 1){
                            playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_") + ", ";
                        } else {
                            playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_");
                        }
                    }
                }
                reply = title = label + " Server Status :white_check_mark:",
                        status = "Players online (" + response.numPlayers + "/" + response.maxPlayers + ") " + playerList;
                resolve();
            }
        });
    });
}
