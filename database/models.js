const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  description: String
})

const LocationSchema = new Schema({
  name: String,
  url: String
})

const PlaceSchema = new Schema({
  id: String,
  likeCount: Number,
  commentsCount: Number,
  permalink: String,
  caption: String,
  mediaUrl: String,
  mediaType: String,
  source: String,

  user: UserSchema,
  location: LocationSchema,
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
