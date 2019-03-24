const path = require('path')

const handleValidationErrors = require('../utils/handle-validation-errors')
const throwError = require('../utils/throw-error')
const removeImage = require('../utils/remove-image')

const Post = require('../models/post')

//? GET ALL POSTS
exports.getPosts = (req, res, next) => {
  // Includes pagination
  const currentPage = req.query.page || 1
  const postsPerPage = 2
  let totalItems

  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count
      return Post.find()
        .skip((currentPage - 1) * postsPerPage)
        .limit(postsPerPage)
    })
    .then(posts => {
      res.status(200).json({ message: 'Posts found', posts, totalItems })
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
        message: 'Post created',
        post: result,
      })
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
      if (!post) throwError('Post not found', 404)

      // clear old image from fs if image is being updated
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

//? DELETE A SINGLE POST
exports.deletePost = (req, res, next) => {
  const { postId } = req.params

  Post.findById(postId)
    .then(post => {
      if (!post) throwError('Post not found', 404)
      // Check if logged-in user is authorized
      // Clear image from fs
      removeImage(path.join('..', post.imageUrl))
      // Remove post from db
      return Post.findByIdAndDelete(postId)
    })
    .then(result => {
      res.status(200).json({ message: 'Post delete', postId })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}
