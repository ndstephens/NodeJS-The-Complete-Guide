exports.getPosts = (req, res, next) => {
  res
    .status(200)
    .json({ posts: [{ title: 'First Post', content: 'dumb shit' }] })
}

exports.createPost = (req, res, next) => {
  const { title, content } = req.body
  // Create post in db
  res.status(201).json({
    message: 'Post created',
    post: {
      id: '123',
      title,
      content,
    },
  })
}
