const mc = require('minecraft-ping');
const Discord = require('discord.js');
const client = new Discord.Client();

client.login('tokenhere');

var command = '!ss';
var servers = {
    "hub" : {
        "label" : "Hub",
        "port" : "24460"
    },
    "ultimate" : {
        "label" : "Ultimate",
        "port" : "25567"
    },
    "beyond" : {
        "label" : "Beyond",
        "port" : "24464"
    },
    "age" : {
        "label" : "Stone Age",
        "port" : "24461"
    },
    "aoe" : {
        "label" : "Age of Engineering",
        "port" : "24468"
    },
};

client.on('message', message => {
    if (message.channel.name != "serverchat" && message.content.startsWith(command)) {
        var embed = {
                "color": 7844437,
                "fields": [],
                "timestamp": new Date().toISOString()
            };

        //remove author command invoke message (requires channel permission "MANAGE_MESSAGES")
        message.delete().catch(err=>client.funcs.log(err, "error"));
        
        var serverCount = 0;
        for (i in servers){
            getStatus(servers[i].port, servers[i].label)
                .then(function(msg) {
                    serverCount++;
                    embed.fields.push(msg)

                    if(serverCount == Object.keys(servers).length){
                      // console.log(embed);
                      message.reply({embed});
                    }
                })
                .catch(function(v) {
                      // catching errors is overrated
                });
        } 

    }
});

function getStatus(port, label) {
    return new Promise(function(resolve, reject) {  
        var reply = "";
        var playerList = "";
        mc.ping_fefd_udp({host: 'localhost', port: port}, function(err, response) {
            if (err) {
                // console.log('ping error', err);
                reply = {
                        "name": label + " Server Status :x:",
                        "value": "Server is offline..",
                      };
                resolve(reply);
            } else {
                // console.log('gotit', response);
                if (response.players.length > 0){
                    for (i in response.players){
                        if (i < response.players.length - 1){
                            playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_") + ", ";
                        } else {
                            playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_");
                        }
                    }
                }              
                reply = {
                        "name": label + " Server Status :white_check_mark:",
                        "value": "Players online (" + response.numPlayers + "/" + response.maxPlayers + ") " + playerList,
                      };
                resolve(reply);
            }
        });
        
        
    });
}
