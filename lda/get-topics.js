const debug = require('debug')('app:get-topics');

const lda = require('./lib')

const { openDB } = require('../database')
const { Place } = require('../database/models')

const stub = require('./stub')

async function main() {
  
  const places = stub //await Place.find().limit(1)
  
  // const places = await Place.find().limit(5)
  // await openDB()
  // console.log(places)

  if(!Array.isArray(places) || !places.length) {
    debug(places)
  }

  places.map(place => {
    console.log(place.caption)
    const documents = place.caption.match( /[^\.!\?]+[\.!\?]+/g );

    const result = lda(documents, 1, 10);

    console.log(result)
  })
}

if (require.main === module) {
  main().then(() => {
    process.exit(0);
  });
}

module.exports = main;
