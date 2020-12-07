const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  id: String,
  likeCount: Number,
  commentsCount: Number,
  permalink: String,
  caption: String,
  mediaUrl: String,
  mediaType: String,
  source: String
}, {
  timestamps: true
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = {
  Place
}
