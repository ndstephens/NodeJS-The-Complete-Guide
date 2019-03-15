require('dotenv').config()
const path = require('path')

const express = require('express')
const { get404 } = require('./controllers/404')
const sequelize = require('./utils/database')

const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')

//* INIT APP
const app = express()
// Port
const port = process.env.PORT || 3000
// View Engine
app.set('view engine', 'ejs')

//* MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

//* ROUTERS
app.use('/', shopRoutes)
app.use('/admin', adminRoutes)

//* 404 ERROR PAGE -- Catch All
app.use(get404)

//* RUN SERVER
// Create/Sync database tables with the Models you created
sequelize
  .sync()
  .then(result => {
    app.listen(port)
  })
  .catch(err => console.log(err))
