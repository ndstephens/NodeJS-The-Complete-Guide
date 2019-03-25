const path = require('path')

const handleValidationErrors = require('../utils/handle-validation-errors')
const throwError = require('../utils/throw-error')
const removeImage = require('../utils/remove-image')

const Post = require('../models/post')
const User = require('../models/user')

//? GET ALL POSTS
exports.getPosts = async (req, res, next) => {
  // Includes pagination
  const currentPage = req.query.page || 1
  const postsPerPage = 2

  try {
    const totalItems = await Post.find().countDocuments()

    const posts = await Post.find()
      .populate('creator')
      .skip((currentPage - 1) * postsPerPage)
      .limit(postsPerPage)

    res.status(200).json({ message: 'Posts found', posts, totalItems })
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}

//? GET A SINGLE POST
exports.getPost = async (req, res, next) => {
  const { postId } = req.params

  try {
    const post = await Post.findById(postId)
    if (!post) throwError('Post not found', 404)

    res.status(200).json({ message: 'Post found', post })
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}

//? CREATE A SINGLE POST
exports.createPost = async (req, res, next) => {
  handleValidationErrors(req)
  // requires an uploaded image
  if (!req.file) throwError('No image provided', 422)

  const { title, content } = req.body
  const imageUrl = req.file.path

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  })

  try {
    await post.save()

    // Add post to logged-in User
    const user = await User.findById(req.userId)
    // Mongoose will handle adding only the post._id since that's what the User's schema is accepting
    user.posts.push(post)
    await user.save()

    res.status(201).json({
      message: 'Post created',
      post,
      creator: { _id: user._id, name: user.name },
    })
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}

//? UPDATE A SINGLE POST
exports.updatePost = async (req, res, next) => {
  handleValidationErrors(req)

  const { postId } = req.params
  const { title, content } = req.body

  // Use new image if one is provided, otherwise use current image
  const imageUrl = req.file ? req.file.path : req.body.image
  if (!imageUrl) throwError('Image not selected', 422)

  try {
    const post = await Post.findById(postId)
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

    const savedPost = await post.save()

    res.status(200).json({ message: 'Post updated', post: savedPost })
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}

//? DELETE A SINGLE POST
exports.deletePost = async (req, res, next) => {
  const { postId } = req.params

  try {
    const post = await Post.findById(postId)
    if (!post) throwError('Post not found', 404)
    // Check that user attempting to delete post was its creator
    if (post.creator.toString() !== req.userId) {
      throwError('Not authorized', 403)
    }

    // Clear image from fs
    removeImage(path.join('..', post.imageUrl))

    // Remove post from db
    await Post.findByIdAndDelete(postId)

    // fetch User object
    const user = await User.findById(req.userId)
    // helpful Mongoose method 'pull' to remove deleted post from User
    user.posts.pull(postId)
    await user.save()

    res.status(200).json({ message: 'Post deleted', postId })
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}
