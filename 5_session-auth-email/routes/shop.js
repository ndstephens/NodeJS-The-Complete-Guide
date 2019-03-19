const express = require('express')
const router = express.Router()

const isAuth = require('../middleware/is-auth')

const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteItem,
  getOrders,
  postOrder,
  // getCheckout,
} = require('../controllers/shop')

//? ------ '/'

router.get('/', getIndex)

router.get('/products', getProducts)

router.get('/products/:productId', getProduct)

router.get('/cart', isAuth, getCart)

router.post('/cart', isAuth, postCart)

router.post('/cart-delete-item', isAuth, postCartDeleteItem)

router.get('/orders', isAuth, getOrders)

router.post('/create-order', isAuth, postOrder)

// router.get('/checkout', getCheckout)

module.exports = router
