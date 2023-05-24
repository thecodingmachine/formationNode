var express = require('express');
var router = express.Router();

var Game = require('./../model/gameModel');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Formation Node', h1 : "Node JS && WebSocket" });
});

router.get('/games', function(req, res, next) {
  const total = Game.find().limit(10);
  total.exec((err, game) => {
    if (err) {
      res.end("error");
      return;
    }
    res.send(game);
  });
});


router.get('/total', function(req, res, next) {
  const count = Game.aggregate([
      {"$match":  {
        "wonColor": {
          "$eq": "red"
        }
      }}
      ,{
    "$count": "wonColor"
  }]);
  count.exec((err, game) => {
    console.log(game);
    if (err) {
      res.end("error");
      return;
    }
    res.send(game);
  });
});



module.exports = router;
