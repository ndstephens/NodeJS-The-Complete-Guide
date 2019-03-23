exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'dumb shit',
        imageUrl: 'images/sketch.jpg',
        creator: {
          name: 'Nate',
        },
        createdAt: new Date(),
      },
    ],
  })
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
