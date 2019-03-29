const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

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

  if (errors.length > 0) {
    const error = new Error('Invalid input')
    error.data = errors
    error.code = 422
    throw error
  }

  const isExistingUser = await User.findOne({ email })
  if (isExistingUser) {
    throw new Error('User already exists')
  }

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
  if (!user) {
    const error = new Error('User not found')
    error.code = 401
    throw error
  }

  const isEqual = await bcrypt.compare(password, user.password)
  if (!isEqual) {
    const error = new Error('Password is incorrect')
    error.code = 401
    throw error
  }

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
  const { title, content, imageUrl } = args.postInput

  const errors = []
  if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
    errors.push({ message: 'Title is invalid' })
  }
  if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
    errors.push({ message: 'Content is invalid' })
  }

  if (errors.length > 0) {
    const error = new Error('Invalid input')
    error.data = errors
    error.code = 422
    throw error
  }

  const post = new Post({
    title,
    content,
    imageUrl,
  })
  const createdPost = await post.save()

  // add post to user's posts

  return {
    ...createdPost._doc,
    _id: createdPost._id.toString(),
    createdAt: createdPost.createdAt.toISOString(),
    updatedAt: createdPost.updatedAt.toISOString(),
  }
}
