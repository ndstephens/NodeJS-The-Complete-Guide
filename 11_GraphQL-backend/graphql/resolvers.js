const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const throwError = require('../utils/throw-error')
const User = require('../models/user')
const Post = require('../models/post')

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
//? CREATE POST
exports.createPost = async (args, req) => {
  if (!req.isAuth) throwError('Not authenticated', 401)

  const { title, content, imageUrl } = args.postInput

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
