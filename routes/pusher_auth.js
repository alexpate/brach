var express = require('express');
var Pusher = require('pusher');

var router = express.Router();

var pusher = new Pusher({
  appId: '201941',
  key: '8dfaafabafb15e7bb4db',
  secret: '22f3add80ec8b7624acb'
});

router.post('/pusher_auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

module.exports = router;
