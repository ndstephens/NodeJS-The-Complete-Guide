require('dotenv').config()
const path = require('path')

const express = require('express')
const { get404 } = require('./controllers/404')
const sequelize = require('./utils/database')

//? ROUTES
const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin')

//? MODELS
const Product = require('./models/product')
const User = require('./models/user')

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

//* ROUTERS
app.use('/', shopRoutes)
app.use('/admin', adminRoutes)

//* 404 ERROR PAGE -- Catch All
app.use(get404)

//* ASSOCIATE TABLES/MODELS IN DB
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)

//* RUN SERVER
// Create/Sync database tables with the Models you created
sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(port)
  })
  .catch(err => console.log(err))
