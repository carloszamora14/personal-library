const mongoose = require ('mongoose');

let BookSchema = new mongoose.Schema({
  title: String, 
  author: String, 
  genre: String,
  status: String
})

module.exports = mongoose.model('books',BookSchema)