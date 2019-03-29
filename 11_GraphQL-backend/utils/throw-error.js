const throwError = (msg = '', code = 404, data = []) => {
  const error = new Error(msg)
  error.code = code
  error.data = data
  throw error
}

module.exports = throwError
