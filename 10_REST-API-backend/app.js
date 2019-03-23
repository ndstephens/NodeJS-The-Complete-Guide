require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

//* IMPORT ROUTES
const feedRoutes = require('./routes/feed')

//* INIT APP
const app = express()
const port = process.env.PORT || 8080

//* MIDDLEWARE
app.use(express.json()) // application/json
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // instead of '*' can list specific domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
}) //? FIX CORS ISSUES

//* INIT ROUTES
app.use('/feed', feedRoutes)

//
//* RUN SERVER
mongoose
  .connect(process.env.MONGO_DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.info('Connected to db')
    app.listen(port, () => console.log(`Server running on ${port}`))
  })
  .catch(err => console.info(err))
