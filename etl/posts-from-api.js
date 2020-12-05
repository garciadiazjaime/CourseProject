const debug = require('debug')('app:crawler');
const fetch = require('node-fetch');
const MongoClient = require('mongodb').MongoClient;
const mapSeries = require('async/mapSeries');

const config = require('../config');

function getDBClient() {
  return new Promise(resolve => {
    MongoClient.connect(config.get('db.url'), function(err, client) {
      resolve(client)
    }); 
  })
}


async function extract(hashtag) {
  const limit = 50;
  const fields = 'caption,like_count,comments_count,media_type,media_url,permalink,children{media_type,media_url}';
  const url = `https://graph.facebook.com/v6.0/${hashtag}/recent_media?fields=${fields}&limit=${limit}&user_id=${config.get('instagram.userId')}&access_token=${config.get('instagram.token')}`;

  const response = await fetch(url);
  return response.json();
}

function transform(data, hashtag) {
  if (!data || !Array.isArray(data.data)) {
    return null;
  }

  return data.data.reduce((accu, item) => {
    const mediaUrl = item.media_type === 'CAROUSEL_ALBUM' ? item.children.data[0].media_url : item.media_url;

    accu.push({
      id: item.id,
      likeCount: item.like_count,
      commentsCount: item.comments_count,
      permalink: item.permalink,
      caption: item.caption,
      mediaUrl,
      mediaType: item.media_type,
      source: hashtag,
    });

    return accu;
  }, []);
}

function savePosts(dbClient, posts) {
  return new Promise(async (resolve) => {
    const collection = dbClient.db("mintitmedia").collection("places");
    const newPost = []

    debug(`places: ${posts.length}`)

    const promises = await mapSeries(posts, async post => {
      return new Promise(resolveUpdate => {
        collection.find({ id : post.id }).toArray((err, docs) => {
          if (err) {
            debug(err)
          }

          if (Array.isArray(docs) && !docs.length) {
            newPost.push(post)
          }

          resolveUpdate()
        });
      })
    })

    await Promise.all(promises)

    debug(`new: ${newPost.length}`)
    
    if (newPost.length) {
      collection.insertMany(newPost, function(err) {
        if (err) {
          return debug(err)
        }

        resolve();
      });
    } else {
      resolve()
    }
  })
}

async function main() {
  const hashtag = config.get('instagram.hashtag')

  const response = await extract(hashtag);
  const posts = await transform(response, hashtag);

  if (!Array.isArray(posts) || !posts.length) {
    debug(response)
    return null
  }

  const dbClient = await getDBClient()

  await savePosts(dbClient, posts)

  dbClient.close();
}

if (require.main === module) {
  main().then(() => {
    process.exit(0);
  });
}

module.exports = main;
