const bcrypt = require('bcryptjs')

const User = require('../models/user')
const handleValidationErrors = require('../utils/handleValidationErrors')
const throwError = require('../utils/throwError')

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
      //
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500
      next(err)
    })
}
