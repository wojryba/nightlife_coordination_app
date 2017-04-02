const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();
const Yelp = require('yelp-api-v3');
const Location = require('./schema');

// Authentication middleware provided by express-jwt.
// This middleware will check incoming requests for a valid
// JWT on any routes that it is applied to.
var authCheck = jwt({
  secret: process.env.SECRET
});

//auth for yelp API
var yelp = new Yelp ({
  app_id: process.env.ID,
  app_secret: process.env.ASECRET
});


router.post('/search', function(req,res){
  var location = req.body.location

  //fetch data from YELP API
  yelp.search({term: "bar", location: location, limit: 25}).then(function(data){
    let locs = JSON.parse(data);
    locs = locs.businesses;
    locs = locs.map(loc => {
      let l = loc;
      l.counter = 0;
      return l;
    })

    // find every locations from db
    Location.find({}, function(error, locations){
      for (let loc of locs) {
        for (let location of locations) {
          // check if current locations are in db
          if (loc.id == location.location){
            // add proper counters if are.
            loc.counter = location.users.length;
          }
        }
      }
      // send locations with proper counters
      return res.send(JSON.stringify(locs));
    })
  })
})

router.post('/add', authCheck, function (req, res) {
  let user = req.user.sub;
  user = user.split('|');
  user = user[1];

  let locs = req.body.query;

  Location.findOrCreate({location: req.body.place}, function(error, location, created){
    if (created) {
      // if true, create location in the db, add user to it
      location.users.push(user);
      location.save();
      // send current counter to front end
      res.send(JSON.stringify(location.users.length));
    } else {
      if (location.users.includes(user)) {
        //remove user from location
        location.users = location.users.filter( val => {
            return val != user;
        })
        location.save();
        // send current counter to front end
        res.send(JSON.stringify(location.users.length));
      } else {
        //add user to location
        location.users.push(user);
        location.save();
        // send current counter to front end
        res.send(JSON.stringify(location.users.length));
      }
    }
  });

})

module.exports = router;
