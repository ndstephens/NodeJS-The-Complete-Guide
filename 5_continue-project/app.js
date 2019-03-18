require('dotenv').config()
const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

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
// Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URL,
  collection: 'sessions',
})
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
    store: store,
  })
)
//? check session auth, make status available to current request w/ res.local
//? add user instance to request object (from session info) so user instance methods are available
app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    res.locals.isAuthenticated = true
    User.findById(req.session.user._id).then(user => {
      req.user = user
      next()
    })
  } else {
    res.locals.isAuthenticated = false
    next()
  }
})

//? add user to the request object
// app.use((req, res, next) => {
// User.findById('5c8ecae38f375680784ae395')
//   .then(user => {
//     req.user = user
//     next()
//   })
//   .catch(err => console.log(err))
// })

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
