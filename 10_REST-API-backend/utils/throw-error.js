const throwError = (msg = '', statusCode = 404) => {
  const error = new Error(msg)
  error.statusCode = statusCode
  throw error
}

module.exports = throwError
