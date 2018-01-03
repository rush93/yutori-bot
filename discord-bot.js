const Discord = require('discord.js');
const bot = new Discord.Client();
var constant = require('./token');
const token = constant.token;
var request = require('request');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();


// var sqlite3    = require('sqlite3').verbose();
// var path       = require('path');

// var outputFile = path.resolve(__dirname, 'data/discord-bot.db');
// var db         = new sqlite3.Database(outputFile);
// db.serialize();

// var cleverbot = require("cleverbot.io");
// const cbot = new cleverbot("a", "b");
// cbot.setNick("yutoribot"+ (Math.random().toString(36).substr(2)));

var reply = function(message,toSend, error) {
  var embed = new Discord.RichEmbed({});
  embed.setColor(error ? 0xA80000 : 0x00AFFF);
  embed.setDescription(toSend);
  embed.setFooter(message.author.username+"#"+message.author.discriminator, message.author.avatarURL);
  message.channel.sendEmbed(embed);
};

var getHightRole = function (roles) {
  var hight;
  roles.every(function (role) {
    if(!hight || hight.comparePositionTo(role) > 0) {
      hight = role;
    }
  });
  return hight;
};

var canExecuteOn = function(author, user) {
  return getHightRole(author.roles).comparePositionTo(getHightRole(user.roles)) >= 0;
};

var commands = {
  'help': {
    args: "[command]",
    help: 'Montre la liste des commandes',
    runCommand: function(args, message) {
      if(args.length < 1 ) {
        var embedField = [];
        Object.keys(commands).map(function(element, index) {
          embedField.push({
            text: `:${element} ${commands[element].args}`,
            title: commands[element].help
          });
        });
        var embed;
        embedField.forEach(function (result, index){
          if (index%4 == 0) {
            if (index != 0) {
             message.channel.sendEmbed(embed);
            }
            embed = new Discord.RichEmbed({});
            embed.setColor(0x00AFFF);
            embed.setTitle('Liste des commandes');
            embed.setDescription("Pour plus d'info sur une commandes faites **:help [commande]**");
            embed.setFooter(message.author.username+"#"+message.author.discriminator, message.author.avatarURL);
          }
          embed.addField(result.text, result.title, false);
        })
        message.channel.sendEmbed(embed);
      } else {
        if(commands[args[0]]) {
          reply(message,args[0] + ': '+ commands[args[0]].help);
        } else {
          reply(message,'Aucune commande de correspond à: '+ args[0],true);
        }
      }
    }
  },
  'kick': {
    args: "<user>",
    help: 'Kick le joueur demander.',
    runCommand: function (args, message) {
      if(!message.member.hasPermission("KICK_MEMBERS")) {
        reply(message,"Tu n'as pas la permission de kicker quelqu'un.",true);
        return;
      }
      if(message.mentions.users && message.mentions.users.array().length > 0) {
        args.shift();
        message.mentions.users.every(function (element) {
          var user = message.guild.member(element);
          if (!canExecuteOn(message.member, user)) {
            reply(message, "Tu ne peux pas kick ce joueur.",true);
            return;
          }
          if(!user.kickable) {
              reply(message, "Ce connard ne peux pas être kick fait le toi même.",true);
              return;
          }
          user.kick().then(function(user) {
            reply(message,"L'utilisateur **"+element.username+ "** à été kick! "+ (args.length>0? "raison: **" + args.join(" ")+"**" : ""));
          }).catch(function (erreur) {
            reply(message,"j'arrive pas a le kick :'( sa dois être un dieu !",true);
          });
        });
      } else {
        reply(message,"Aucuns joueurs mentioné.",true);
      }
    }
  },
  'def': {
    args: "<word>",
    help: 'donne la définition du mot.',
    runCommand: function (args, message) {
      if (args.length >= 1) {
        var qs = encodeURIComponent("Définition de: " + args.join(' '));
        reply(message, "définition: http://www.laissemoichercherca.com/?q=" + qs);
      } else {
        reply(message, "Tu dois donner un mot du con, sinon je te donne la définition de mon cul ?", true)
      }
    }
  },
  'chuck': {
    args: "",
    help: 'chuck noris fact.',
    runCommand: function (args, message) {
      request('https://www.chucknorrisfacts.fr/api/get?data=tri:alea', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var fact = entities.decode(JSON.parse(body)[0].fact);
            reply(message, fact);
        }
     })
    }
  },
  // 'forbidden': {
  //   args: "<letters>",
  //   help: 'Ajoute des lettres interdites.',
  //   runCommand: function (args, message) {
  //     var server = message.channel.guild;
  //     if (args.length == 0 ) {
  //       db.all('SELECT * from forbidden WHERE id_server = ?', [server.id] , function (err, rows) {
  //         var forbiddens = [];
  //         rows.forEach(function (result) {
  //           forbiddens.push(result.caracters);
  //         });
  //         if (forbiddens.length == 0) {
  //           reply(message, "Rien n'est interdi.");
  //           return;
  //         }
  //         reply(message, "Les lettres interdites sont: "+ forbiddens.join(", "));
  //       });
  //       return;
  //     }
  //     var letters = args.join(' ');
  //     if(!message.member.hasPermission("ADMINISTRATOR")) {
  //       reply(message,"Tu n'as pas la permission de mettres des lettres interdites.",true);
  //       return;
  //     }
  //     db.run('INSERT into forbidden(id_server, name, caracters) VALUES(?, ?, ?)', [server.id, server.name, letters], function(err, row) {
  //       if(letters.length > 1) {
  //         reply(message, "Les lettres **__" + letters + "__** sont maintenant interdites, le prochain qui les dis sera kick.");
  //       } else {
  //         reply(message, "La lettre **__" + letters + "__** est maintenant interdit, le prochain qui la dis sera kick.");
  //       }
  //     });
  //   }
  // },
  // 'unforbidden': {
  //   args: "<letters>",
  //   help: "enleve le forbiden sur une lettre",
  //   runCommand:  function (args, message) {
  //     if(!message.member.hasPermission("ADMINISTRATOR")) {
  //       reply(message,"Tu n'as pas la permission de réautoriser des lettres.",true);
  //       return;
  //     }
  //     if (args.length == 0 ) {
  //       reply(message,"Vous devez mettre un argument.",true);
  //       return;
  //     } 
  //     db.get("SELECT * from forbidden WHERE id_server = ? AND caracters = ?", [message.channel.guild.id, args.join(' ')], function (err, row) {
  //       if (row == null) {
  //         reply(message,"Ces lettres ne sont pas interdites.",true);
  //         return;
  //       }
  //       db.run("DELETE FROM forbidden WHERE id = ?", [row.id], function (err, row) {
  //         reply(message,"Les lettres **__"+args.join(' ')+"__** sont maintenant autorisée.");
  //       });
  //     }); 
  //   }
  // }
};


bot.on('ready', function() {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
  bot.user.setGame('Niquer des mères');
  // cbot.create(function (err, session) {
  //   console.log(session);
  // });
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

 } else if (/<@(\!)*304615265860321280>/.test(message.content)) {
    //304987331054665759 test
    //304615265860321280 real
    // message.channel.startTyping();
    // var texttosend = message.content.replace('<@304615265860321280> ','').replace('<@!304615265860321280> ','')
    // cbot.ask(texttosend, function (err, response) {
    //   message.channel.stopTyping();
    //   if(err) {
    //     message.channel.sendMessage("bah la je peu pas répondre mon cerveau est down");
    //     return;
    //   }
    //   message.channel.sendMessage(response);
    // });
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
  // else if (!message.author.bot) {

  //   db.all('SELECT * FROM forbidden WHERE id_server = ?', [message.channel.guild.id], function(err, rows) {
  //     rows.forEach(function (result) {
  //       if (message.content.indexOf(result.caracters) != -1) {
  //         message.member.kick().then(function (user) {
  //           reply(message,"L'utilisateur **"+message.author.username+ "** à été kick! car il y avais: **__"+ result.caracters +"__** dans sa phrase.");
  //         }).catch(function (erreur) {
  //           reply(message,"tu as perdu tu as dis **__" + result.caracters + "__** dans ta phrase." ,true);
  //         });
  //       }
  //     });
  //   });
  // }
});

bot.login(token);
