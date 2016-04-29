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

router.post('/game/:id/results', function(req, res) {
  var results = req.body.results;
  var wins = [];
  var returnResult = [];

  for (var i = 0; i < results.length; i++) {
    wins[i] = 0;
  }

  for (var i = 0; i < results.length; i++) {
    for (var j = (i + 1); j < results.length; j++) {
      choice1 = parseInt(results[i].choice);
      choice2 = parseInt(results[j].choice);
      victor = whoWins(choice1, choice2);

      switch (victor) {
        case 0:
          //draw
          break;
        case 1:
          wins[i]++;
          break;
        case 2:
          wins[j]++
          break;
        default:
          console.log("ERROR: unknown result");
      }
    }

    //build the output
    var obj = { user_id: results[i].user_id, wins: wins[i] }
    returnResult.push(obj);
  }

  res.status(200).send(returnResult);
});

function generateSessionKey(size) {
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   for (var i=0; i < size; i++)
       text += possible.charAt(Math.floor(Math.random() * possible.length));

   return text;
}

function whoWins(choice1, choice2) {
  var victor = 0;

  //1=paper, 2=scissors, 3=rock, 0 = nothing

  if (choice2 == 0) {
    if (choice1 != 0) {
      victor = 1;
    }
  }
  else {
    switch (choice1) {
      case 0:
          victor = 2;
          break;
      case 1:
        if (choice2 == 2) {
          victor = 2;
        }
        else if (choice2 == 3) {
          victor = 1
        }
        break;
      case 2:
        if (choice2 == 1) {
          victor = 1;
        }
        else if (choice2 == 3) {
          victor = 2;
        }
        break;
      case 3:
        if (choice2 == 1) {
          victor = 2;
        } else if (choice2 == 2) {
          victor = 1;
        }
        break;
      default:
        console.log("ERROR: unknown choice");
        victor = 0;
    }
  }

  return victor;
}


module.exports = router;
