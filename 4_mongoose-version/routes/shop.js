const express = require('express')

const {
  getIndex,
  getProducts,
  getProduct,
  // getCart,
  postCart,
  // postCartDeleteItem,
  // getOrders,
  // postOrder,
  // getCheckout,
} = require('../controllers/shop')

//? ------ '/'
const router = express.Router()

router.get('/', getIndex)

router.get('/products', getProducts)

router.get('/products/:productId', getProduct)

// router.get('/cart', getCart)

router.post('/cart', postCart)

// router.post('/cart-delete-item', postCartDeleteItem)

// router.get('/orders', getOrders)

// router.post('/create-order', postOrder)

// router.get('/checkout', getCheckout)

module.exports = router
