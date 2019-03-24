const path = require('path')
// const { validationResult } = require('express-validator/check')

const handleValidationErrors = require('../utils/handleValidationErrors')
const throwError = require('../utils/throwError')
const removeImage = require('../utils/removeImage')

const Post = require('../models/post')

//? GET ALL POSTS
exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({ message: 'Posts found', posts })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}

//? CREATE A SINGLE POST
exports.createPost = (req, res, next) => {
  handleValidationErrors(req)
  if (!req.file) throwError('No image provided', 422)

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
      res.status(201).json({
        message: 'Post created successfully',
        post: result,
      })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}

//? GET A SINGLE POST
exports.getPost = (req, res, next) => {
  const { postId } = req.params

  Post.findById(postId)
    .then(post => {
      if (!post) throwError('Post not found', 404)
      res.status(200).json({ message: 'Post found', post })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}

//? UPDATE A SINGLE POST
exports.updatePost = (req, res, next) => {
  handleValidationErrors(req)

  const { postId } = req.params
  const { title, content } = req.body
  const imageUrl = req.file ? req.file.path : req.body.image

  if (!imageUrl) throwError('Image not selected', 422)

  Post.findById(postId)
    .then(post => {
      if (!postId) throwError('Post not found', 404)

      // clear old image if image is being updated
      if (imageUrl !== post.imageUrl) {
        removeImage(path.join('..', post.imageUrl))
      }

      post.title = title
      post.content = content
      post.imageUrl = imageUrl

      return post.save()
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated', post: result })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}
