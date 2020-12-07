const debug = require('debug')('app:main');
const cron = require('node-cron');
const express = require('express')
const fetch = require('node-fetch');

const path = require('path')
const PORT = process.env.PORT || 3000

express()
  .get('/', (req, res) => {
    debug('homepage')
    return res.json({ msg: ':)' })
  })
  .listen(PORT, () => debug(`Listening on ${ PORT }`))

const postsFromAPI = require('./etl/posts-from-api')

function main() {
  cron.schedule('*/5 * * * *', async () => {
    await fetch('https://chicago-food-20.herokuapp.com/');

    debug('postsFromAPI')
    await postsFromAPI();
  });
}

main()
