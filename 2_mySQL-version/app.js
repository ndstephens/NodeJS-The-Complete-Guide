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
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

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
  User.findByPk(1)
    .then(user => {
      req.user = user // attach user to the request body for access within app
      next()
    })
    .catch(err => console.log(err))
})

//* ROUTERS
app.use('/', shopRoutes)
app.use('/admin', adminRoutes)

//* 404 ERROR PAGE -- Catch All
app.use(get404)

//* TABLE/MODEL ASSOCIATIONS
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)

Cart.belongsTo(User)
User.hasOne(Cart)

Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

Order.belongsTo(User)
User.hasMany(Order)

Order.belongsToMany(Product, { through: OrderItem })
Product.belongsToMany(Order, { through: OrderItem })

//* RUN SERVER
// Create/Sync database tables with the Models you created
sequelize
  // .sync({ force: true })
  .sync()
  .then(() => User.findByPk(1))
  .then(user => {
    if (!user) {
      return User.create({ name: 'Nate', email: 'nate@email.com' })
    }
    return user
  })
  // .then(user => user.createCart()) // create dummy cart
  .then(() => app.listen(port))
  .catch(err => console.log(err))
