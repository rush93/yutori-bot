var utils = require('../utils');
var def = {
    args: "<word>",
    help: 'donne la définition du mot.',
    runCommand: function (args, message) {
        if (args.length >= 1) {
            var qs = encodeURIComponent("Définition de: " + args.join(' '));
            utils.reply(message, "définition: http://www.laissemoichercherca.com/?q=" + qs);
        } else {
            utils.reply(message, "Tu dois donner un mot du con, sinon je te donne la définition de mon cul ?", true)
        }
    }
}
exports.def = def;