const Product = require('../models/product')

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      pageTitle: 'Shop',
      activeTab: 'shop',
      products,
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/products', {
      pageTitle: 'Products',
      activeTab: 'products',
      products,
    })
  })
}

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    activeTab: 'cart',
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    activeTab: 'checkout',
  })
}
