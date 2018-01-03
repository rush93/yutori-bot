var utils = require('../utils');

var kick = {
    args: "<user>",
    help: 'Kick le joueur demander.',
    runCommand: function (args, message) {
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            utils.reply(message, "Tu n'as pas la permission de kicker quelqu'un.", true);
            return;
        }
        if (message.mentions.users && message.mentions.users.array().length > 0) {
            args.shift();
            message.mentions.users.every(function (element) {
                var user = message.guild.member(element);
                if (!utils.canExecuteOn(message.member, user)) {
                    utils.reply(message, "Tu ne peux pas kick ce joueur.", true);
                    return;
                }
                if (!user.kickable) {
                    utils.reply(message, "Ce connard ne peux pas être kick fait le toi même.", true);
                    return;
                }
                user.kick().then(function (user) {
                    utils.reply(message, "L'utilisateur **" + element.username + "** à été kick! " + (args.length > 0 ? "raison: **" + args.join(" ") + "**" : ""));
                }).catch(function (erreur) {
                    utils.reply(message, "j'arrive pas a le kick :'( sa dois être un dieu !", true);
                });
            });
        } else {
            utils.reply(message, "Aucuns joueurs mentioné.", true);
        }
    }
}
exports.kick = kick;