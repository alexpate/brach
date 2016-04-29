var express = require('express');
var router = express.Router();
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '201941',
  key: '8dfaafabafb15e7bb4db',
  secret: '22f3add80ec8b7624acb'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/game/new', function(req, res, next) {
  var gameId = generateSessionKey(16);
  STORE.set(gameId, {
    players: 1,
    running: false
  });

  res.send({ gameId: gameId });
});

router.get('/game/:id', function(req, res, next) {
  var gameId = req.param('id');

  var state = STORE.get(gameId);
  res.render('game', {
    title: 'The Game',
    gameId: req.params.id,
    state: state
  });
});

router.post('/pusher_auth', function(req, res) {
  var names = ['bob', 'john'];

  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var presenceData = {
    user_id: generateSessionKey(8),
    user_info: {
      name: generateSessionKey(6)
    }
  };
  var auth = pusher.authenticate(socketId, channel, presenceData);

  res.send(auth);
});

function generateSessionKey(size) {
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   for (var i=0; i < size; i++)
       text += possible.charAt(Math.floor(Math.random() * possible.length));

   return text;
}

module.exports = router;
