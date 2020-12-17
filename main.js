const debug = require('debug')('app:main');
const cron = require('node-cron');
const express = require('express')
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')
const mapSeries = require('async/mapSeries');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

const postsFromAPI = require('./etl/posts-from-api')
const { getPlacesFromTopic, getTopicsFromPlaces, addChoice, updatePost } = require('./support/places')
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
      debug('EMTPY_CACHE_FOR_TOPICS')
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

    const cacheKey = `getPlacesFromTopic:${category}`
    let places = myCache.get(cacheKey)

    if (!places) {
      debug('EMTPY_CACHE_FOR_SEARCH')
      places = await getPlacesFromTopic(category)

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
  .post('/post/:id', async (req, res) => {
    const id = req.params.id
    const data = req.body

    const response = await updatePost(id, data)
    
    const msg = !response ? 'ERROR' : 'POST_UPDATED'

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

  const topics = await getTopicsFromPlaces()

  if (Array.isArray(topics) && topics.length) {
    const cacheKey = 'getTopicsFromPlaces'
    debug('TOPICS_UPDATED')
    if (!myCache.ttl(cacheKey, secondsInAnHour )) {
      myCache.set(cacheKey, topics, secondsInAnHour)
    }
  }

  const responses = await mapSeries(topics, async ([topic]) => {
    const places = await getPlacesFromTopic(topic)

    if (Array.isArray(places) && places.length) {
      const cacheKey = `getPlacesFromTopic:${topic}`
      debug(`PLACES_UPDATES:${topic}`)
      if (!myCache.ttl(cacheKey, secondsInAnHour )) {
        myCache.set(cacheKey, places, secondsInAnHour)
      }
    }
  })

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
