const debug = require('debug')('app:main');
const cron = require('node-cron');
const express = require('express')
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')
const mapSeries = require('async/mapSeries');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const postsFromAPI = require('./etl/posts-from-api')
const { getPlacesFromCategory, getTopicsFromPlaces, addChoice } = require('./support/places')
const { openDB } = require('./database');
const config = require('./config');

const API_URL = config.get('api.url')
const PORT = process.env.PORT || 3030

const secondsInAnHour = 60 * 60

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'))
app.use(cors())

app
  .get('/', (req, res) => {
    return res.json({ msg: ':)' })
  })
  .get('/topics', async (req, res) => {
    const cacheKey = 'getTopicsFromPlaces'
      let topics = myCache.get(cacheKey)

      if (!topics) {
        topics = await getTopicsFromPlaces()

        if (Array.isArray(topics) && topics.length) {
          myCache.set(cacheKey, topics, secondsInAnHour)
        }
      }

      return res.json(topics)
  })
  .get('/search', async (req, res) => {
    const { category } = req.query

    if (!category) {
      return res.json({ msg: 'EMPTY_CATEGORY' })
    }

    const cacheKey = `getPlacesFromCategory:${category}`
    let places = myCache.get(cacheKey)

    if (!places) {
      places = await getPlacesFromCategory(category)

      if (Array.isArray(places) && places.length) {
        myCache.set(cacheKey, places, secondsInAnHour)
      }
    }

    return res.json(places)
  })
  .post('/choice', async (req, res) => {
    const { id, topic } = req.body

    const response = await addChoice(id, topic)
    
    const msg = !response ? 'ERROR' : 'CHOICE_ADDED'

    return res.json({ msg })
  })

function setupCron() {
  if (config.get('env') !== 'production') {
    return debug('CRON_NOT_SETUP')
  }

  cron.schedule('*/20 * * * *', async () => {
    await postsFromAPI();
  });

  cron.schedule('*/10 * * * *', async () => {
    await fetch(API_URL);
  });

  cron.schedule('2 * * * *', async () => {
    debug('REFRESH_SEARCHES')
    await refreshSearches()
  });
}

async function refreshSearches() {
  if (config.get('env') !== 'production') {
    return debug('REFRESH_NOT_SETUP')
  }

  const response = await fetch(`${API_URL}/topics`);
  const topics = await response.json()

  const responses = await mapSeries(topics, async (topic) => fetch(`${API_URL}/search?category=${topic[0]}`))

  await Promise.all(responses)
}

async function main() {
  await openDB()

  app.listen(PORT, async () => {
    debug(`Listening on ${ PORT }`)

    setupCron()

    await refreshSearches()
  })
}

main()
