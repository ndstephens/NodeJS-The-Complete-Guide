require('dotenv').config()
const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

//? MODELS
const User = require('./models/user')

//? ROUTES
const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')

//? CONTROLLERS
const { get404, get500 } = require('./controllers/404')

//*--------------------------------------------------/
//*           INITIALIZE APP
//*--------------------------------------------------/
const app = express()
// Port
const port = process.env.PORT || 3000
// View Engine
app.set('view engine', 'ejs')
// Multer File Parsing and Storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'image-uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const fileFilter = (req, file, cb) => {
  if (/image\/(jpg|jpeg|png)/.test(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
// Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URL,
  collection: 'sessions',
})
// CSRF
const csrfProtection = csrf()

//

//*--------------------------------------------------/
//*           MIDDLEWARE
//*--------------------------------------------------/
// STATIC FILES AND IMAGES
app.use(express.static(path.join(__dirname, 'public')))
app.use('/image-uploads', express.static(path.join(__dirname, 'image-uploads')))
// PARSE FORM DATA
app.use(express.urlencoded({ extended: true }))
// MULTER FILE PARSING / UPLOAD (attaches file to request object -- req.file)
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
)
// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
)
// CSRF
app.use(csrfProtection)
// FLASH ERROR MESSAGES
app.use(flash())
// add auth status and csrfToken to res
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})
//? add user instance to request object (from session info) so user instance methods are available
app.use((req, res, next) => {
  if (!req.session.user) return next()
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) return next()
      req.user = user
      next()
    })
    .catch(err => next(err))
})

//* ROUTERS
app.use('/', shopRoutes)
app.use('/admin', adminRoutes)
app.use('/', authRoutes)

//* 500 SERVER ERROR
app.get('/500', get500)

//* 404 ERROR PAGE -- Catch All
app.use(get404)

//* EXPRESS ERROR HANDLER
app.use((err, req, res, next) => {
  // res.status(err.statusCode).render(...)
  res.redirect('/500')
})

//

//*--------------------------------------------------/
//*           RUN SERVER
//*--------------------------------------------------/
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(port, () => console.log(`Server running on port ${port}...`))
  )
  .catch(err => console.log(err))
