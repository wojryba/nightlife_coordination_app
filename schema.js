const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new Schema({
  user: String,
  places: {type: Array, default: []}
});

UserSchema.plugin(findOrCreate);

const locationSchema = new Schema({
  location: String,
  users: {type: Array, default: []}
});

locationSchema.plugin(findOrCreate);
const Location = mongoose.model('Location', locationSchema);

const User = mongoose.model('User', UserSchema);
module.exports = Location;
