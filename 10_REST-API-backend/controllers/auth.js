const bcrypt = require('bcryptjs')

const User = require('../models/user')
const handleValidationErrors = require('../utils/handleValidationErrors')

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
