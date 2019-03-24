const fs = require('fs')
const path = require('path')

const removeImage = filePath => {
  const fullFilePath = path.join(__dirname, filePath)
  fs.unlink(fullFilePath, err => console.log(err))
}

module.exports = removeImage
