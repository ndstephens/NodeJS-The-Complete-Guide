const jwt = require('jsonwebtoken')

const throwError = require('../utils/throw-error')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if (!authHeader) {
    throwError('Not authenticated', 401)
  }

  const token = authHeader.replace('Bearer ', '')
  let decodedToken

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    err.statusCode = 500
    throw err
  }

  if (!decodedToken) {
    throwError('Not authenticated', 401)
  }

  req.userId = decodedToken.userId
  next()
}
