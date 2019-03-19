const express = require('express')
const router = express.Router()

const isAuth = require('../middleware/is-auth')

const {
  getAddProduct,
  postAddProduct,
  getListProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require('../controllers/admin')

//? ------ '/admin'

router.get('/add-product', getAddProduct)

router.post('/add-product', isAuth, postAddProduct)

router.get('/list-products', isAuth, getListProducts)

router.get('/edit-product/:productId', isAuth, getEditProduct)

router.post('/edit-product', isAuth, isAuth, postEditProduct)

router.post('/delete-product', isAuth, postDeleteProduct)

module.exports = router
