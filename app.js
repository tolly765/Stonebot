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
        var msgarr = message.content.split(" ");
        var server = msgarr[1];
        var reply = "";
        
        //remove author command invoke message (requires channel permission "MANAGE_MESSAGES")
        message.delete().catch(err=>client.funcs.log(err, "error"));
        
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
        if (err === null) {
            var playerlist = "";
            if (response.players.length > 0){
                for (i in response.players){
                    if (i < response.players.length - 1){
                        playerlist += response.players[i].replace(new RegExp("_", 'g'), "\\_") + ", ";
                    } else {
                        playerlist += response.players[i].replace(new RegExp("_", 'g'), "\\_");
                    }
                }
            }
            var reply = ":white_check_mark: " + label + " is online! Players (" + response.numPlayers + "/" + response.maxPlayers +") " + playerlist;
            cb(reply);
        } else {
            var reply = ":x: " + label + " is offline!";
            cb(reply);
        }
    });
    
}
