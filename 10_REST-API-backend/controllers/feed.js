const { validationResult } = require('express-validator/check')

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
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: 'Validation failed', errors: errors.array() })
  }

  const { title, content } = req.body
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully',
    post: {
      _id: '123',
      title,
      content,
      creator: {
        name: 'Nate',
      },
      createdAt: new Date(),
    },
  })
}
