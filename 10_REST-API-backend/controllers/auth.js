const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const handleValidationErrors = require('../utils/handle-validation-errors')
const throwError = require('../utils/throw-error')

//? CREATE OR UPDATE USER
exports.signup = async (req, res, next) => {
  handleValidationErrors(req)

  const { email, name, password } = req.body

  try {
    const hashedPW = await bcrypt.hash(password, 12)

    const user = new User({
      email,
      password: hashedPW,
      name,
    })

    const newUser = await user.save()

    res.status(201).json({ message: 'User created', userId: newUser._id })
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}

//? LOGIN USER
exports.login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) throwError('User not found', 404)

    const isCorrectPassword = await bcrypt.compare(password, user.password)
    if (!isCorrectPassword) throwError('Incorrect password', 401)

    // Create a JWT that expires in 1 hour
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.status(200).json({ token, userId: user._id.toString() })
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}

//? GET USER STATUS
exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) throwError('User not found', 404)

    res.status(200).json({ status: user.status })
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}

//? UPDATE USER STATUS
exports.updateUserStatus = async (req, res, next) => {
  handleValidationErrors(req)

  try {
    const user = await User.findById(req.userId)
    if (!user) throwError('User not found', 404)

    user.status = req.body.status
    await user.save()

    res.status(200).json({ message: 'User status updated' })
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500
    next(err)
  }
}
