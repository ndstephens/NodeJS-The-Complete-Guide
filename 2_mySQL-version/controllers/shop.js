const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        activeTab: 'shop',
        products,
      })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render('shop/products', {
        pageTitle: 'Products',
        activeTab: 'products',
        products,
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const { productId } = req.params
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
  Cart.getCartContents(cart => {
    const { products, totalPrice } = cart
    res.render('shop/cart', {
      pageTitle: 'Cart',
      activeTab: 'cart',
      products,
      totalPrice,
    })
  })
}

exports.postCart = (req, res, next) => {
  const product = JSON.parse(req.body.product)
  Cart.addProduct(product, err => {
    if (err) {
      next()
    } else {
      res.redirect('/cart')
    }
  })
}

exports.postCartDeleteItem = (req, res, next) => {
  Cart.deleteCartItem(req.body.productId, err => {
    if (err) {
      next()
    } else {
      res.redirect('/cart')
    }
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
