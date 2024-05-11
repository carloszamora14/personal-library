const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  name: String,
  userName: String,
  email: String,
  password: String
})

module.exports = mongoose.model('users', UserSchema)