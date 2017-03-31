const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new Schema({
  user: String,
  places: {type: Array, default: []}
});

UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);
module.exports = User;
