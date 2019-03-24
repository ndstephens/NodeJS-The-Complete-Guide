const { validationResult } = require('express-validator/check')

const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({ message: 'Posts found', posts })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed')
    error.statusCode = 422
    throw error
  }
  if (!req.file) {
    const error = new Error('No image provided')
    error.statusCode = 422
    throw error
  }

  const { title, content } = req.body
  const imageUrl = req.file.path

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: {
      name: 'Nate',
    },
  })

  post
    .save()
    .then(result => {
      console.info(result)
      res.status(201).json({
        message: 'Post created successfully',
        post: result,
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.getPost = (req, res, next) => {
  const { postId } = req.params

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post not found')
        error.statusCode = 404
        throw error
      }
      res.status(200).json({ message: 'Post found', post })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
