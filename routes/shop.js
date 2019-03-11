const path = require('path')

const express = require('express')
const rootDir = require('../utils/rootDir')
const { products } = require('./admin')

const router = express.Router()

router.get('/', (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
  res.render('shop', {
    pageTitle: 'Shop',
    products,
  })
})

module.exports = router
