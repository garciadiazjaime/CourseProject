const mongoose = require('mongoose');

const config = require('../config');

async function openDB() {
  await mongoose.connect(config.get('db.url'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
}

module.exports = {
  openDB
}
