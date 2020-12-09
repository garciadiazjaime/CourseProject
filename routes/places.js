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

module.exports = {
  getPlacesFromCategory
}
