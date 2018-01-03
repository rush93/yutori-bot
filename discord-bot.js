const Discord = require('discord.js');
const bot = new Discord.Client();
var constant = require('./token');
const token = constant.token;

var chuck = require('./commandes/chuck');
var def = require('./commandes/def');
var kick = require('./commandes/kick');


commands = {
  'help': {
    args: "[command]",
    help: 'Montre la liste des commandes',
    runCommand: function (args, message) {
        if (args.length < 1) {
            var embedField = [];
            Object.keys(commands).map(function (element, index) {
                embedField.push({
                    text: `:${element} ${commands[element].args}`,
                    title: commands[element].help
                });
            });
            var embed;
            embedField.forEach(function (result, index) {
                if (index % 4 == 0) {
                    if (index != 0) {
                        message.channel.sendEmbed(embed);
                    }
                    embed = new Discord.RichEmbed({});
                    embed.setColor(0x00AFFF);
                    embed.setTitle('Liste des commandes');
                    embed.setDescription("Pour plus d'info sur une commandes faites **:help [commande]**");
                    embed.setFooter(message.author.username + "#" + message.author.discriminator, message.author.avatarURL);
                }
                embed.addField(result.text, result.title, false);
            })
            message.channel.sendEmbed(embed);
        } else {
            if (commands[args[0]]) {
                utils.reply(message, args[0] + ': ' + commands[args[0]].help);
            } else {
                utils.reply(message, 'Aucune commande de correspond à: ' + args[0], true);
            }
        }
        return;
    }
},
  'kick': kick.kick,
  'def': def.def,
  'chuck': chuck.chuck
};
exports.commands = commands;

bot.on('ready', function() {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
  bot.user.setGame('Niquer des mères');
  
});

bot.on('message', function(message) {
  if( /^\:([a-zA-Z0-9])+( |$)/.test(message.content)) {
   var args = message.content.split(" ");
   var label = args.shift().substring(1);

   if (message.deletable) {
     message.delete();
   }
   if(commands[label]) {
     commands[label].runCommand(args,message);
   }

 }
  else if (/^roll/i.test(message.content)) {
    

    message.channel.sendMessage('Une chance sur 6 de mourir...');
    setTimeout(function() {
      message.channel.sendMessage(':gun: Attention Je tire !');

      setTimeout(function() {
        if(Math.floor(Math.random() * 6) === 0) {
          message.channel.sendMessage(':boom:');
          setTimeout(function() {
            message.channel.sendMessage('Domage pour toi t\'es mort.');
          }, 1000)
          return;
        }
        message.channel.sendMessage('Click !');
        setTimeout(function() {
          message.channel.sendMessage('Ta eu de la chance, cette fois si.');
        }, 1000)
      }, 2000);      
    },1000);

  } else if (/bot.*\?$/i.test(message.content)) {
    var rep = ["oui", "non", "peut etre", "Absolument", "certainement pas",
    "seulement si rush dis oui", "dans tes rêves", "quand les poules aurons un bec",
    "j'en sais rien moi", "tu crois que je suis dieu ou quoi vas te faire voir","nique ta mère",
    "oui... oui... (il faut faire semblant sinon il vas être triste)",
    "à ton avis ? tu es vraiment stupide des fois.", "si on prend en compte que tu es gay, oui",
    "non non non et non.", "42", "attend je faisais ma branlette répète  ?", "Si tu me suce oui",
    "Si ta bite ne dépasse pas celle de Rush'R c'est non (1m20)"];
    message.channel.sendMessage(rep[Math.floor(Math.random() * rep.length)]);
  } else if (/(bot.*merde)|(merde.*bot)/i.test(message.content)) {
    message.channel.sendMessage("c'est toi la merde.");
  } else if (/quoi[^a-zA-Z0-9]*$/i.test(message.content)) {
    message.channel.sendMessage("Feur");
  }
});

bot.login(token);
