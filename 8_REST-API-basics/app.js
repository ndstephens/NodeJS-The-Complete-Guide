const express = require('express')

//* IMPORT ROUTES
const feedRoutes = require('./routes/feed')

//* INIT APP
const app = express()

//* MIDDLEWARE
app.use(express.json())

//* INIT ROUTES
app.use('/feed', feedRoutes)

//
//* RUN SERVER
app.listen(8080)
