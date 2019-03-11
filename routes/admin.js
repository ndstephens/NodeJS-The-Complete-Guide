const path = require('path')

const express = require('express')
const rootDir = require('../utils/rootDir')

//? /admin

const router = express.Router()
const products = []

router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title })
  res.redirect('/')
})

exports.adminRoutes = router
exports.products = products
