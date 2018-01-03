var utils = require('../utils');
var request = require('request');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

var chuck = {
  args: "",
  help: 'chuck noris fact.',
  runCommand: function (args, message) {
    request('https://www.chucknorrisfacts.fr/api/get?data=tri:alea', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var fact = entities.decode(JSON.parse(body)[0].fact);
          utils.reply(message, fact);
      }
   })
  }
}

exports.chuck = chuck;