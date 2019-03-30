require('dotenv').config()

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const helmet = require('helmet')

//* IMPORT ROUTES
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

//* INIT APP
const app = express()
const port = process.env.PORT || 8080

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
  next()
})

//* INIT ROUTES
app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

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
    console.log('Connected to db')
    app.listen(port, () => console.log(`Server running on ${port}`))
  })
  .catch(err => console.log(err))
