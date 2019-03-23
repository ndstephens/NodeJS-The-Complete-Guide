const express = require('express')

//* IMPORT ROUTES
const feedRoutes = require('./routes/feed')

//* INIT APP
const app = express()

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
app.listen(8080)
