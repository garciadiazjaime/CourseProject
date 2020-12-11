const debug = require('debug')('app:crawler');
const fetch = require('node-fetch');
const mapSeries = require('async/mapSeries');

const config = require('../config');
const { openDB } = require('../database')
const { Place } = require('../database/models')


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
    if (!item.caption || item.media_type === 'VIDEO') {
      return accu
    }

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

async function savePosts(posts) {
  debug(`places: ${posts.length}`)

  const newPost = []

  const promises = await mapSeries(posts, async post => {
    const places = await Place.find({ id : post.id })
    
    if (Array.isArray(places) && !places.length) {
      newPost.push(post)
    }
  })

  await Promise.all(promises)

  debug(`new: ${newPost.length}`)
  
  if (newPost.length) {
    const newPromises = await mapSeries(newPost, async post => Place(post).save())

    await Promise.all(newPromises)
  }
}

async function main() {
  const hashtag = config.get('instagram.hashtag')

  const response = await extract(hashtag);
  const posts = await transform(response, hashtag);

  if (!Array.isArray(posts) || !posts.length) {
    return debug(response)
  }

  await savePosts(posts)
}

if (require.main === module) {
  openDB()
    .then(main)
    .then(() => {
    process.exit(0);
  });
}

module.exports = main;
