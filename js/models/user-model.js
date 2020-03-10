import { Schema, model } from 'mongodb';

var userSchema = new Schema({
  username: {type: String, unique: true,},
  name:   String,
  age: number,
  email: {type: string, unique: true, lowercase: true,},
  password: string,
});

let userModel = model('User', userSchema);

module.exports = userModel;