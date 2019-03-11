const path = require('path')

const express = require('express')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// INIT APP
const app = express()
const port = process.env.PORT || 3000

// MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

// ROUTERS
app.use('/', shopRoutes)
app.use('/admin', adminRoutes)

// 404 ERROR PAGE -- Catch All
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

// RUN SERVER
app.listen(port)
