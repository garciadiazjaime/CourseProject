const { Place } = require('../database/models')
const { getTopics } = require('../lda/get-topics')

async function getPlacesFromCategory(category) {
  const places = await Place.find({}).sort({createdAt: -1}).limit(100)

  const placesWithTopics = places.map(place => ({
    id: place.id,
    caption: place.caption,
    permalink: place.permalink,
    mediaUrl: place.mediaUrl,
    topics: getTopics(place.caption),
  }))
  // console.log(placesWithTopics)

  return placesWithTopics.filter(place => place.topics.includes(category))
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
    .slice(0, 20)

  return rank
}
 
module.exports = {
  getPlacesFromCategory,
  getTopicsFromPlaces
}
