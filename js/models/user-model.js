const mongoose = require('mongoose');
Schema = mongoose.Schema; 

var userSchema = new Schema({
  username: {type: String, unique: true,},
  name:   String,
  age: Number,
  email: {type: String, unique: true, lowercase: true,},
  password: String,
});

let User = mongoose.model('User', userSchema);

module.exports = User;