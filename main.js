const cron = require('node-cron');

const postsFromAPI = require('./etl/posts-from-api')

function main() {
  console.log('executing main')
  cron.schedule('*/5 * * * *', async () => {
    await postsFromAPI();
  });
}

main()
