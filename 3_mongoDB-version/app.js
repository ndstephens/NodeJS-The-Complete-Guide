require('dotenv').config()
const path = require('path')

const express = require('express')
const { mongoConnect } = require('./utils/database')
const { get404 } = require('./controllers/404')

//? MODELS
const User = require('./models/user')

//? ROUTES
const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')

//*--------------------------------------------------/
//*           INITIALIZE APP
//*--------------------------------------------------/
// Express App
const app = express()
// Port
const port = process.env.PORT || 3000
// View Engine
app.set('view engine', 'ejs')

//* MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  User.findById('5c8d48f511f4704da7212ba3')
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

//* ROUTERS
app.use('/', shopRoutes)
app.use('/admin', adminRoutes)

//* 404 ERROR PAGE -- Catch All
app.use(get404)

//* RUN SERVER
mongoConnect(() => {
  app.listen(port, () => console.log('Server running...'))
})
