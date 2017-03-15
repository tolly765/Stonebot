const mc = require('minecraft-ping');
const Discord = require('discord.js');
const client = new Discord.Client();

client.login('tokenhere');

var command = '!serverstatus';
var servers = {
    "hub" : {
        "label" : "Hub",
        "port" : "24460"
    },
    "dw20" : {
        "label" : "Direwolf20",
        "port" : "24461"
    },
    "sf3" : {
        "label" : "SkyFactory 3",
        "port" : "24462"
    },
    "ultimate" : {
        "label" : "Ultimate",
        "port" : "25567"
    },
    "beyond" : {
        "label" : "Beyond",
        "port" : "24464"
    },
};

client.on('message', message => {
    if (message.channel.name != "serverchat" && message.content.startsWith(command)) {
        var msgarr = message.content.split(" ");
        var server = msgarr[1];
        var reply = "";
        
        if (server === "all") {
            for (i in servers){
                getStatus(servers[i].port, servers[i].label, function(response) {
                    message.reply(response);
                });
            }
        } else if (typeof servers[server] === "undefined"){
            for (i in servers){
                reply += i + " ";
            }
            message.reply("Nope! Valid servers: " + reply);
        } else {
            getStatus(servers[server].port, servers[server].label, function(response) {
                message.reply(response);
            });
        }
        
    }
});

function getStatus(port, label, cb) {
    mc.ping_fefd_udp({host: 'localhost', port: port}, function(err, response) {
        if (err == null) {
            var playerlist = "";
            if (response.players.length > 0){
                for (i in response.players){
                    if (i < response.players.length - 1){
                        playerlist += response.players[i] + ", ";
                    } else {
                        playerlist += response.players[i];
                    }
                }
            }
            var reply = ":green_heart: " + label + " server is online! Players (" + response.numPlayers + "/" + response.maxPlayers +") " + playerlist;
            cb(reply);
        } else {
            var reply = ":red_circle: " + label + " server is offline!";
            cb(reply);
        }
        //console.log(err, response);
    });
    
}
