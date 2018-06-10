const Discord = require('discord.js');
const request = require('request');
module.exports = {
    name: 'mojang',
    description: 'Check the status of the Mojang servers',
    execute(message) {
        var url = "https://mcapi.ca/mcstatus";
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                officialembded = new Discord.RichEmbed()
                    .setColor('#66A866')
                    .setTitle('Official Minecraft Services Status')

                    .addField('Authentication service', body['authserver.mojang.com'].status)
                    .addField('Session servers', body['sessionserver.mojang.com'].status)
                    .addField('Skins', body['textures.minecraft.net'].status)
                    .addField('Public API', body['api.mojang.com'].status)

                    .setThumbnail('https://www.stonebound.net/assets/mojang.png')
                    .setURL('https://help.mojang.com/')

                message.channel.send("", { embed: officialembded });
            } else {
                message.channel.send("Could not connect to Mojang's API.");
            }
        });
        //message.channel.send(avatarList);
    },
};