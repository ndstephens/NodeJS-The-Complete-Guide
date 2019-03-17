const express = require('express')

const {
  getAddProduct,
  postAddProduct,
  // getListProducts,
  // getEditProduct,
  // postEditProduct,
  // postDeleteProduct,
} = require('../controllers/admin')

//? ------ '/admin'
const router = express.Router()

router.get('/add-product', getAddProduct)

router.post('/add-product', postAddProduct)

// router.get('/list-products', getListProducts)

// router.get('/edit-product/:productId', getEditProduct)

// router.post('/edit-product', postEditProduct)

// router.post('/delete-product', postDeleteProduct)

module.exports = router
