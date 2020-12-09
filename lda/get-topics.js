const debug = require('debug')('app:get-topics');

const lda = require('./lib')

const { openDB } = require('../database')
const { Place } = require('../database/models')

const stub = require('./stub')

function transform(topics) {
  if (!Array.isArray(topics) || !topics.length) {
    return []
  }

  return topics[0].reduce((accu, topic) => {
    accu.push(topic.term)

    return accu
  }, [])
}

function extractTopics(data) {
  const documents = data.match( /[^\.!\?]+[\.!\?]+/g);

  return lda(documents, 1, 10)
}

function getTopics(data) {
  const topics = extractTopics(data)

  return transform(topics);
}

async function main(document) {
  
const places = stub 
  
  // const places = await Place.find().limit(1)
  console.log(places)

  places.map(place => {
    const topics = extractTopics(place.caption)
    console.log('transform', transform(topics))
  })
}

if (require.main === module) {
  openDB()
    .then(main)
    .then(() => {
      process.exit(0);
    })
}

module.exports = {
  getTopics
};
