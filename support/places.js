
const mapSeries = require('async/mapSeries');
const { ObjectID } = require('mongodb');

const { Place, Choice } = require('../database/models')
const { getTopics } = require('../lda/get-topics')

async function getPlacesFromTopic(category) {
  const places = await Place.find({}).sort({createdAt: -1}).limit(500)

  const placesWithTopics = places.map(place => ({
    id: place.id,
    caption: place.caption,
    permalink: place.permalink,
    mediaUrl: place.mediaUrl,
    topics: getTopics(place.caption),
  }))

  return placesWithTopics.filter(place => place.topics.includes(category)).slice(0, 15)
}

async function getTopicsFromPlaces() {
  const places = await Place.find({}).sort({createdAt: -1}).limit(500)

  const topics = places.reduce((accu, place) => {

    getTopics(place.caption).forEach(topic => {
      if (!accu[topic]) {
        accu[topic] = 0
      }

      accu[topic] += 1
    })

    return accu
  }, {})

  const rank = Object.keys(topics)
    .map(key => [key, topics[key]])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)

  return rank
}

async function addChoice(id, topic) {
  if (!id || !topic) {
    return null
  }

  return Choice({ id, topic}).save()
}

async function removeDuplicates() {
  const places = await Place.aggregate([
    { $group: { _id: "$id", count: { $sum: 1}, id: { $first: "$_id"} }}, 
    { $match: { count: { $gt: 1 }}}, 
    { $sort: { count: -1 }},
  ]);
  
  const promises = await mapSeries(places, async place => Place.findOneAndRemove({ _id: ObjectID(place.id)})) 

  return Promise.all(promises)
}

async function updatePost(id, update) {
  const filter = { id }

  return await Place.findOneAndUpdate(filter, update)
}

async function deletePost(id) {
  const filter = { id }

  await Choice.deleteMany(filter)

  return Place.deleteMany(filter)
}
 
module.exports = {
  getPlacesFromTopic,
  getTopicsFromPlaces,
  addChoice,
  removeDuplicates,
  updatePost,
  deletePost,
}
