const WebSocket = require('ws');
var Game = require('./../model/gameModel');
var newUsers = [];

module.exports.init = function(server) {
  const wss = new WebSocket.Server({server: server});
  var startGame = starGameWss(wss);

  wss.on('connection', function connection(ws, req) {
    ws.on('message', function incoming(messageString) {
      var message = JSON.parse(messageString);
      if (message.msg === 'newUser') {
        var newUser = {
          id: message.id
        };
        newUsers.push(newUser);
        ws.send(JSON.stringify(newUser));
        if (newUsers.length >= 2) {
          startGame(newUsers[0], newUsers[1]);
          newUsers.shift();
          newUsers.shift();
        }
      } else if (message.msg === 'gameAction') {
        Game.findOne({'_id': message.gameId}).exec(function(err, game) {
              if (err) {
                console.error(err);
              } else {
                game.gameAction(message.userId, message.caseName);
                game.save();
                wss.clients.forEach(function each(client) {
                  if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(game));
                  }
                });
              }
            }
        );
      }
    });

  });

  function starGameWss(wss) {
    return function(user0, user1) {
      var game = new Game();
      game.initGame(user0, user1);
      game.save();
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(game));
        }
      });
    };
  }
};

