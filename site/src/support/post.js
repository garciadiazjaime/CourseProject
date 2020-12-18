import { updatePost, deletePost } from './service-client'

function pickOne(posts) {
  return posts[Math.floor(Math.random() * posts.length)]
}

async function extract(url) {
  const res = await fetch(url);
  return res.text()
}

function transform(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const image = Array.from(doc.head.children).find((element, index) => element.attributes.property && element.attributes.property.value.includes('og:image'))
  
  const script = Array.from(doc.scripts).find(script => script.innerText.includes('schema.org'))

  if (!script) {
    return null
  }

  const data = JSON.parse(script.innerText)

  const response = {
    user: {
      username: data.author.alternateName.replace('@', ''),
      description: data.name.replace(/ on Instagram.*/,'')
    },
    likeCount: data.interactionStatistic.userInteractionCount,
    commentsCount: data.commentCount,
  }

  if (image) {
    response.mediaUrl = image.attributes.content.value
  }

  const location = data.contentLocation ? {
    name: data.contentLocation.name,
    url: data.contentLocation.mainEntityofPage['@id'],
  } : null

  if (location) {
    response.location = location
  }

  return response
}

async function validatePosts(posts) {
  if (!Array.isArray(posts) || !posts.length) {
    return null
  }

  const post = pickOne(posts)
  const { permalink } = post
  
  const html = await extract(permalink)

  if (html.includes('Login • Instagram')) {
    return null
  }

  if (html.includes('Page Not Found')) {
    return deletePost(post.id)
  }

  const data = transform(html)

  if (!data) {
    return null
  }
  
  await updatePost(post.id, data)
}


export {
  validatePosts
} 
