const express = require('express')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// INIT APP
const app = express()
const port = process.env.PORT || 3000

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }))

// ROUTERS
app.use(adminRoutes)
app.use(shopRoutes)

// 404 ERROR PAGE
app.use((req, res, next) => {
  res.status(404).send(`<h1>Page not Found</h1>`)
})

// RUN SERVER
app.listen(port)
