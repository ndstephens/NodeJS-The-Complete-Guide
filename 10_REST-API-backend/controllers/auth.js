const User = require('../models/user')
const handleValidationErrors = require('../utils/handleValidationErrors')

exports.signup = (req, res, next) => {
  handleValidationErrors(req)

  const { email, name, password } = req.body
}
