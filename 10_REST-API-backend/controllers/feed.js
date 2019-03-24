const path = require('path')

const handleValidationErrors = require('../utils/handle-validation-errors')
const throwError = require('../utils/throw-error')
const removeImage = require('../utils/remove-image')

const Post = require('../models/post')
const User = require('../models/user')

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

  let creator
  const { title, content } = req.body
  const imageUrl = req.file.path

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  })

  post
    .save()
    .then(() => {
      return User.findById(req.userId)
    })
    .then(user => {
      creator = user
      user.posts.push(post)
      return user.save()
    })
    .then(() => {
      res.status(201).json({
        message: 'Post created',
        post,
        creator: { _id: creator._id, name: creator.name },
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

      // Check that user attempting to update post was its creator
      if (post.creator.toString() !== req.userId) {
        throwError('Not authorized', 403)
      }

      // Clear old image from fs if image is being updated
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

      // Check that user attempting to delete post was its creator
      if (post.creator.toString() !== req.userId) {
        throwError('Not authorized', 403)
      }

      // Clear image from fs
      removeImage(path.join('..', post.imageUrl))

      // Remove post from db
      return Post.findByIdAndDelete(postId)
    })
    .then(result => {
      res.status(200).json({ message: 'Post deleted', postId })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}
