const path = require('path')

const express = require('express')
const { get404 } = require('./controllers/404')

const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')

// INIT APP
const app = express()
const port = process.env.PORT || 3000
app.set('view engine', 'ejs') // views directory set by default

// MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

// ROUTERS
app.use('/', shopRoutes)
app.use('/admin', adminRoutes)

// 404 ERROR PAGE -- Catch All
app.use(get404)

// RUN SERVER
app.listen(port)
