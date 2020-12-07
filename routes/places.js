const { Place } = require('../database/models')
const { getTopics } = require('../lda/get-topics')

async function getPlacesFromCategory(category) {
  const places = await Place.find({}).sort({createdAt: -1}).limit(1)
  console.log('places', places)
  // const placesTopics = places.filter(place => getTopics(place.caption))
  // console.log('placesTopics', placesTopics)

  // return placesTopics.filter(place => place.includes(category))
  return places
}

module.exports = {
  getPlacesFromCategory
}
