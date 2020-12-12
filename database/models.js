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
  source: String,
}, {
  timestamps: true
});

const ChoiceSchema = new Schema({
  id: String,
  topic: String
})

const Place = mongoose.model('Place', PlaceSchema);
const Choice = mongoose.model('Choice', ChoiceSchema)

module.exports = {
  Place,
  Choice,
}
