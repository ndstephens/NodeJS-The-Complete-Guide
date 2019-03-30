require('dotenv').config()

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const graphqlHttp = require('express-graphql')
const helmet = require('helmet')

const auth = require('./middleware/auth')
const removeImage = require('./utils/remove-image')

//? IMPORT GRAPHQL SCHEMA AND RESOLVER
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')

//* INIT APP
const app = express()
const port = process.env.PORT || 8080

//? MULTER file handling config
const filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})
const fileFilter = (req, file, cb) => {
  if (/image\/(jpg|jpeg|png)/.test(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

//* MIDDLEWARE
// HELMET
app.use(helmet())
// JSON PARSING
app.use(express.json())
// FILE UPLOADING
app.use(multer({ storage: filestorage, fileFilter }).single('image'))
// STATIC IMAGES
app.use('/images', express.static(path.join(__dirname, 'images')))
// FIX CORS ISSUES
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // instead of '*' can list specific domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
// JWT AUTH
app.use(auth)
// UPLOADED IMAGE HANDLING
app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) throw new Error('Not authenticated')
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided' })
  }

  if (req.body.oldPath) removeImage(req.body.oldPath)

  return res
    .status(201)
    .json({ message: 'File stored', filePath: req.file.path })
})

//* GRAPHQL 'ROUTE'
app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err
      }
      const { data, code = 500 } = err.originalError
      const message = err.message || 'An error occurred'
      return { message, status: code, data }
    },
  })
)

//
//* ERROR HANDLING
app.use((error, req, res, next) => {
  console.log(error)
  const { statusCode = 500, message = '', data = [] } = error
  res.status(statusCode).json({ message, data })
})

//
//* RUN SERVER
mongoose
  .connect(process.env.MONGO_DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to db...')
    app.listen(port, () => console.log(`Server running on ${port}...`))
  })
  .catch(err => console.log(err))
