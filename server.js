const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();


const port = process.env.PORT || 3000;

var connect = process.env.MONGODB_URI ||  "mongodb://localhost/nightlife-app";

mongoose.connect(connect);
mongoose.connection.on("connected", function(){
  console.log("Connected to db");
});


const app = express();

//enable connection from diffrent domain, for front end angular2
app.use(cors());

//set static folder for anfular2 files
app.use(express.static(path.join(__dirname, 'dist')));

//add middleware bodyparser
app.use(bodyParser.json());




//setting the routes
const api = require('./api')
app.use('/api', api);

//redirect to angulr all the routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


//start server
app.listen(port, function(){
  console.log("connected to server on port " + port);
});
