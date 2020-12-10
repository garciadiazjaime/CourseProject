const debug = require('debug')('app:main');
const cron = require('node-cron');
const express = require('express')
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const postsFromAPI = require('./etl/posts-from-api')
const { getPlacesFromCategory, getTopicsFromPlaces } = require('./support/places')
const { openDB } = require('./database')

const PORT = process.env.PORT || 3000

const secondsInAnHour = 60 * 60

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'))

app
  .get('/', (req, res) => {
    debug('homepage')
    return res.json({ msg: ':)' })
  })
  .get('/search', async (req, res) => {
    const { category } = req.query

    if (!category) {
      return res.json({ msg: 'EMPTY_CATEGORY' })
    }

    let places = myCache.get('getPlacesFromCategory')
    if (!places) {
      places = await getPlacesFromCategory(category)
      myCache.set('getPlacesFromCategory', places, secondsInAnHour)
    }

    return res.json(places)
  })
  .get('/topics', async (req, res) => {
      let topics = myCache.get('getTopicsFromPlaces')

      if (!topics) {
        topics = await getTopicsFromPlaces()
        myCache.set('getTopicsFromPlaces', topics, secondsInAnHour)
      }

      return res.json(topics)
  })

function setupCron() {
  cron.schedule('*/15 * * * *', async () => {
    await fetch('https://chicago-food-20.herokuapp.com/');

    debug('postsFromAPI')
    await postsFromAPI();
  });
}

async function main() {
  setupCron()

  await openDB()

  app.listen(PORT, () => debug(`Listening on ${ PORT }`))
}

main()
