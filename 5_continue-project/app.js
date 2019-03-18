require('dotenv').config()
const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

//? MODELS
const User = require('./models/user')

//? ROUTES
const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')

//? CONTROLLERS
const { get404 } = require('./controllers/404')

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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)

//? add user to the request object
app.use((req, res, next) => {
  User.findById('5c8ecae38f375680784ae395')
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

//* ROUTERS
app.use('/', shopRoutes)
app.use('/admin', adminRoutes)
app.use('/', authRoutes)

//* 404 ERROR PAGE -- Catch All
app.use(get404)

//* RUN SERVER
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  // .then(() => {
  //   const user = new User({
  //     name: 'Nate',
  //     email: 'nate@email.com',
  //     cart: {
  //       items: [],
  //     },
  //   })
  //   user.save()
  // })
  .then(() => app.listen(port, () => console.log('Server running...')))
  .catch(err => console.log(err))
