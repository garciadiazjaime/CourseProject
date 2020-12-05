const debug = require('debug')('app:main');
const cron = require('node-cron');
const express = require('express')

const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .get('/', (req, res) => res.render(':)'))
  .listen(PORT, () => debug(`Listening on ${ PORT }`))

const postsFromAPI = require('./etl/posts-from-api')

function main() {
  cron.schedule('*/5 * * * *', async () => {
    debug('postsFromAPI')
    await postsFromAPI();
  });
}

main()
