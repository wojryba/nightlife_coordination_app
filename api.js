const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();
const Yelp = require('yelp-api-v3');
const User = require('./schema');

// Authentication middleware provided by express-jwt.
// This middleware will check incoming requests for a valid
// JWT on any routes that it is applied to.
var authCheck = jwt({
  secret: process.env.SECRET
});

var yelp = new Yelp ({
  app_id: process.env.ID,
  app_secret: process.env.ASECRET
});


router.post('/search', function(req,res){
  var location = req.body.location

  yelp.search({term: "bar", location: location, limit: 25}).then(function(data){
    let loc = JSON.parse(data);
    loc = loc.businesses;
    loc = loc.map(loc => {
      let l = loc;
      l.counter = 0;
      return l;
    })

    User.find({}, function(error, users){

      loc = loc.map( val => { // add usars to places
        for (let user of users){
          let places = user.places;
          for (let place of places){
            if (place == val.id) {
              val.counter = val.counter + 1;
            }
          }
        }
        return val;
      })
    return res.send(JSON.stringify(loc));
    })
  })
})

router.post('/add', authCheck, function (req, res) {
  let user = req.user.sub;
  user = user.split('|');
  user = user[1];

  User.findOrCreate({user: user}, function(error, user, created){
    if (created) {
      user.places.push(req.body.place);
      user.save();
    } else {
      function findPlace(place) {
        return place == req.body.place
      }
      if (user.places.find(findPlace)) {
        user.places = user.places.filter( val => {
          return val !== req.body.place;
        });
        user.save();
        return res.send("user removed");
      } else {
        user.places.push(req.body.place);
        user.save();
        return res.send("user added");
      };
    }
  });
})

module.exports = router;
