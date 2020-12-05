const convict = require('convict');

// Define a schema
const config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  api: {
    url: {
      doc: 'API URL',
      format: String,
      default: 'http://127.0.0.1:3030',
      env: 'API_URL',
    },
  },
  db: {
    url: {
      doc: 'API URL',
      format: String,
      default: 'http://127.0.0.1:3030',
      env: 'DB_URL',
    },
  },
  instagram: {
    token: {
      env: 'INSTAGRAM_TOKEN',
      default: '',
    },
    hashtag: {
      env: 'INSTAGRAM_HASHTAG_ID',
      default: 'hashtag',
    },
    userId: {
      env: 'INSTAGRAM_USER_ID',
      default: '',
    }
  }
});

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
