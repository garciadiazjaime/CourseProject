async function updatePost(id, body) {
  await fetch(`process.API_URL/post/${id}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });	

}

export {
  updatePost
}
