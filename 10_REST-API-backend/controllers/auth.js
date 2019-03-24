const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const handleValidationErrors = require('../utils/handle-validation-errors')
const throwError = require('../utils/throw-error')

//? CREATE OR UPDATE USER
exports.signup = (req, res, next) => {
  handleValidationErrors(req)

  const { email, name, password } = req.body

  bcrypt
    .hash(password, 12)
    .then(hashedPW => {
      const user = new User({
        email,
        password: hashedPW,
        name,
      })
      return user.save()
    })
    .then(result => {
      res.status(201).json({ message: 'User created', userId: result._id })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}

//? LOGIN USER
exports.login = (req, res, next) => {
  const { email, password } = req.body
  let foundUser

  User.findOne({ email })
    .then(user => {
      if (!user) throwError('User not found', 404)

      foundUser = user
      return bcrypt.compare(password, user.password)
    })
    .then(isCorrectPassword => {
      if (!isCorrectPassword) throwError('Incorrect password', 401)

      // Create a JWT that expires in 1 hour
      const token = jwt.sign(
        {
          email: foundUser.email,
          userId: foundUser._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )

      res.status(200).json({ token, userId: foundUser._id.toString() })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}

//? GET USER STATUS
exports.getUserStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) throwError('User not found', 404)

      res.status(200).json({ status: user.status })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}

//? UPDATE USER STATUS
exports.updateUserStatus = (req, res, next) => {
  handleValidationErrors(req)

  const newStatus = req.body.status

  User.findById(req.userId)
    .then(user => {
      if (!user) throwError('User not found', 404)

      user.status = newStatus
      return user.save()
    })
    .then(() => {
      res.status(200).json({ message: 'User status updated' })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}
