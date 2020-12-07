const debug = require('debug')('app:get-topics');

const lda = require('./lib')

const { openDB } = require('../database')
const { Place } = require('../database/models')

const stub = require('./stub')

function getTopics(data) {
  const documents = data.match( /[^\.!\?]+[\.!\?]+/g);

  return lda(documents, 1, 10);
}

async function main(document) {
  
  const places = stub 
  
  // await openDB()
  // const places = await Place.find().limit(1)
  // console.log(places)

  places.map(place => {
    console.log(place.caption)
    
    const topics = getTopics(place.caption)
    console.log(topics)
  })
}

if (require.main === module) {
  main().then(() => {
    process.exit(0);
  });
}

module.exports = getTopics;
