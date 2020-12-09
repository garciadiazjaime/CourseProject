const debug = require('debug')('app:main');
const cron = require('node-cron');
const express = require('express')
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const postsFromAPI = require('./etl/posts-from-api')
const { getPlacesFromCategory } = require('./routes/places')
const { openDB } = require('./database')

const PORT = process.env.PORT || 3000

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

    const places = await getPlacesFromCategory(category)

    return res.json(places)
  })

function setupCron() {
  cron.schedule('*/10 * * * *', async () => {
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
