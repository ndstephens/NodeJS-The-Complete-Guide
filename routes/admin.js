const path = require('path')

const express = require('express')
const {
  getAddProduct,
  postAddProduct,
  getListProducts,
  getEditProduct,
} = require('../controllers/admin')

//? ------ '/admin'
const router = express.Router()

router.get('/add-product', getAddProduct)

router.post('/add-product', postAddProduct)

router.get('/list-products', getListProducts)

router.get('/edit-product/:productId', getEditProduct)

module.exports = router
