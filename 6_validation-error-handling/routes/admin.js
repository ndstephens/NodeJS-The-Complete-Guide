const express = require('express')
const { body } = require('express-validator/check')

const isAuth = require('../middleware/is-auth')

const router = express.Router()

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

router.post(
  '/add-product',
  [
    body('title', 'Must include a title')
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 }),
    // body('imageUrl', 'Must be a valid URL').isURL(),
    body('price', 'Price must be a number').isFloat(),
    body('description', 'Must include a description')
      .isString()
      .trim()
      .isLength({ min: 1, max: 500 }),
  ],
  isAuth,
  postAddProduct
)

router.get('/list-products', isAuth, getListProducts)

router.get('/edit-product/:productId', isAuth, getEditProduct)

router.post(
  '/edit-product',
  [
    body('title', 'Must include a title')
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 }),
    // body('imageUrl', 'Must be a valid URL').isURL(),
    body('price', 'Price must be a number').isFloat(),
    body('description', 'Must include a description')
      .isString()
      .trim()
      .isLength({ min: 1, max: 500 }),
  ],
  isAuth,
  postEditProduct
)

router.post('/delete-product', isAuth, postDeleteProduct)

module.exports = router
