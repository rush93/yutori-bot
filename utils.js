const Discord = require('discord.js');

var reply = function (message, toSend, error) {
    var embed = new Discord.RichEmbed({});
    embed.setColor(error ? 0xA80000 : 0x00AFFF);
    embed.setDescription(toSend);
    embed.setFooter(message.author.username + "#" + message.author.discriminator, message.author.avatarURL);
    message.channel.sendEmbed(embed);
};

var getHightRole = function (roles) {
    var hight;
    roles.every(function (role) {
        if (!hight || hight.comparePositionTo(role) > 0) {
            hight = role;
        }
    });
    return hight;
};

var canExecuteOn = function (author, user) {
    return getHightRole(author.roles).comparePositionTo(getHightRole(user.roles)) >= 0;
};
exports.reply = reply;
exports.getHightRole = getHightRole;
exports.canExecuteOn = canExecuteOn;