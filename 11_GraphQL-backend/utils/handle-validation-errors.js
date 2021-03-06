const { validationResult } = require('express-validator/check')

const handleValidationErrors = (
  req,
  msg = 'Validation failed',
  statusCode = 422
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error(msg)
    error.statusCode = statusCode
    error.data = errors.array()
    throw error
  }
}

module.exports = handleValidationErrors
