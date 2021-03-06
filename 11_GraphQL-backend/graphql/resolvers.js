const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const throwError = require('../utils/throw-error')
const removeImage = require('../utils/remove-image')
const User = require('../models/user')
const Post = require('../models/post')

//*--------------------------------------------------/
//*         QUERIES
//*--------------------------------------------------/
//? LOGIN
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) throwError('User not found', 401)

  const isEqual = await bcrypt.compare(password, user.password)
  if (!isEqual) throwError('Password is incorrect', 401)

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  return { token, userId: user._id.toString() }
}

//
//? GET ALL POSTS -- PAGINATION
exports.posts = async ({ page = 1 }, req) => {
  if (!req.isAuth) throwError('Not authenticated', 401)

  const perPage = 2

  const totalPosts = await Post.find().countDocuments()
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate('creator')

  return {
    totalPosts,
    posts: posts.map(p => {
      return {
        ...p._doc,
        _id: p._id.toString(),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }
    }),
  }
}

//
//? GET SINGLE POST (BY ID)
exports.post = async ({ id }, req) => {
  if (!req.isAuth) throwError('Not authenticated', 401)

  const post = await Post.findById(id).populate('creator')
  if (!post) throwError('No post found', 404)

  return {
    ...post._doc,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }
}

//? GET LOGGED IN USER
exports.user = async (args, req) => {
  if (!req.isAuth) throwError('Not authenticated', 401)

  const user = await User.findById(req.userId)
  if (!user) throwError('No user found', 404)

  return {
    ...user._doc,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

//

//*--------------------------------------------------/
//*         MUTATIONS
//*--------------------------------------------------/
//? CREATE USER
exports.createUser = async (args, req) => {
  const { name, email, password } = args.userInput

  const errors = []
  if (!validator.isEmail(email)) {
    errors.push({ message: 'Email is invalid' })
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 5 })
  ) {
    errors.push({ message: 'Password too short' })
  }
  if (errors.length > 0) throwError('Invalid input', 422, errors)

  const isExistingUser = await User.findOne({ email })
  if (isExistingUser) throwError('User already exists', 400)

  const hashedPw = await bcrypt.hash(password, 8)

  const user = new User({
    name,
    email,
    password: hashedPw,
  })
  const createdUser = await user.save()

  return { ...createdUser._doc, _id: createdUser._id.toString() }
}

//
//? CREATE POST
exports.createPost = async ({ postInput }, req) => {
  if (!req.isAuth) throwError('Not authenticated', 401)

  const { title, content, imageUrl } = postInput

  const errors = []
  if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
    errors.push({ message: 'Title is invalid' })
  }
  if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
    errors.push({ message: 'Content is invalid' })
  }
  if (errors.length > 0) throwError('Invalid input', 422, errors)

  const user = await User.findById(req.userId)
  if (!user) throwError('User not found', 404)

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: user,
  })
  const createdPost = await post.save()

  user.posts.push(createdPost)
  await user.save()

  return {
    ...createdPost._doc,
    _id: createdPost._id.toString(),
    createdAt: createdPost.createdAt.toISOString(),
    updatedAt: createdPost.updatedAt.toISOString(),
  }
}

//
//? UPDATE POST (BY ID)
exports.updatePost = async ({ id, postInput }, req) => {
  if (!req.isAuth) throwError('Not authenticated', 401)

  const post = await Post.findById(id)
  if (!post) throwError('No post found', 404)

  if (post.creator.toString() !== req.userId.toString()) {
    throwError('Not authorized', 403)
  }

  const { title, content, imageUrl } = postInput
  const errors = []
  if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
    errors.push({ message: 'Title is invalid' })
  }
  if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
    errors.push({ message: 'Content is invalid' })
  }
  if (errors.length > 0) throwError('Invalid input', 422, errors)

  post.title = title
  post.content = content
  if (imageUrl !== 'undefined') {
    // old image removed in middleware in app.js
    post.imageUrl = imageUrl
  }

  const updatedPost = await post.save()
  return {
    ...updatedPost._doc,
    _id: updatedPost._id.toString(),
    createdAt: updatedPost.createdAt.toISOString(),
    updatedAt: updatedPost.updatedAt.toISOString(),
  }
}

//
//? DELETE POST (BY ID)
exports.deletePost = async ({ id }, req) => {
  if (!req.isAuth) throwError('Not authenticated', 401)

  const post = await Post.findById(id)
  if (!post) throwError('No post found', 404)

  if (post.creator.toString() !== req.userId.toString()) {
    throwError('Not authorized', 403)
  }

  removeImage(post.imageUrl)
  await Post.findByIdAndDelete(id)

  const user = await User.findById(req.userId)
  user.posts.pull(id)
  await user.save()

  return true
}

//
//? UPDATE STATUS (OF LOGGED IN USER)
exports.updateStatus = async ({ status }, req) => {
  if (!req.isAuth) throwError('Not authenticated', 401)

  const user = await User.findById(req.userId)
  if (!user) throwError('No user found', 404)

  user.status = status
  const updatedUser = await user.save()

  return {
    ...updatedUser._doc,
    _id: updatedUser._id.toString(),
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
  }
}
