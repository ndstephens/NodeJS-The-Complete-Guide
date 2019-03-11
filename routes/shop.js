const path = require('path')

const express = require('express')
const rootDir = require('../utils/rootDir')
const { products } = require('./admin')

const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('Shop.js:', products)
  res.sendFile(path.join(rootDir, 'views', 'shop.html'))
})

module.exports = router
