const debug = require('debug')('app:main');
const cron = require('node-cron');
const express = require('express')
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const postsFromAPI = require('./etl/posts-from-api')
const { getPlacesFromCategory, getTopicsFromPlaces } = require('./support/places')
const { openDB } = require('./database')

const PORT = process.env.PORT || 3030

const secondsInAnHour = 60 * 60

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'))

app
  .get('/', (req, res) => {
    return res.json({ msg: ':)' })
  })
  .get('/search', cors(), async (req, res) => {
    const { category } = req.query

    if (!category) {
      return res.json({ msg: 'EMPTY_CATEGORY' })
    }

    const key = `getPlacesFromCategory:${category}`
    let places = myCache.get(key)
    if (!places) {
      places = await getPlacesFromCategory(category)
      myCache.set(key, places, secondsInAnHour)
    }

    return res.json(places)
  })
  .get('/topics', cors(), async (req, res) => {
      let topics = myCache.get('getTopicsFromPlaces')

      if (!topics) {
        topics = await getTopicsFromPlaces()
        myCache.set('getTopicsFromPlaces', topics, secondsInAnHour)
      }

      return res.json(topics)
  })

function setupCron() {
  cron.schedule('*/30 * * * *', async () => {
    await postsFromAPI();
  });

  cron.schedule('*/10 * * * *', async () => {
    await fetch('https://chicago-food-20.herokuapp.com/');
  });
}

async function main() {
  await openDB()

  setupCron()

  app.listen(PORT, () => debug(`Listening on ${ PORT }`))
}

main()
