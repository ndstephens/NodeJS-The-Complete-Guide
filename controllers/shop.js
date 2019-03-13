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

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId
  Product.findById(productId, product => {
    if (!product) {
      next() // caught by 404
    } else {
      res.render('shop/product-detail', {
        pageTitle: 'Product Detail',
        activeTab: 'products',
        product,
      })
    }
  })
}

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    activeTab: 'cart',
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    activeTab: 'orders',
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    activeTab: 'checkout',
  })
}
