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
  res.send({gameId: _generateSessionKey(8)});
});

function _generateSessionKey(size) {
 var text = "";
 var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

 for (var i=0; i < size; i++)
     text += possible.charAt(Math.floor(Math.random() * possible.length));

 return text;
}

router.get('/game/:id', function(req, res, next) {
  res.render('game', {title: 'The Game'});
});

router.post('/pusher_auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

module.exports = router;
