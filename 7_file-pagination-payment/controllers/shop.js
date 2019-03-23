const Product = require('../models/product')
const Order = require('../models/order')
// const User = require('../models/user')

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        activeTab: 'shop',
        products,
      })
    })
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/products', {
        pageTitle: 'Products',
        activeTab: 'products',
        products,
      })
    })
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: 'Product Detail',
        activeTab: 'products',
        product,
      })
    })
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(user => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        activeTab: 'cart',
        products: user.cart.items,
      })
    })
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.postCart = (req, res, next) => {
  req.user
    .addToCart(req.body.productId)
    .then(() => res.redirect('/cart'))
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.postCartDeleteItem = (req, res, next) => {
  req.user
    .deleteFromCart(req.body.productId)
    .then(() => res.redirect('/cart'))
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        activeTab: 'orders',
        orders,
      })
    })
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.postOrder = (req, res, next) => {
  req.user
    .getCart()
    .then(user => {
      const cartProducts = user.cart.items.map(item => ({
        product: { ...item.productId._doc }, // store the populated data
        quantity: item.quantity,
      }))

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products: cartProducts,
      })

      return order.save()
    })
    .then(() => {
      return req.user.clearCart()
    })
    .then(() => res.redirect('/orders'))
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

// // exports.getCheckout = (req, res, next) => {
// //   res.render('shop/checkout', {
// //     pageTitle: 'Checkout',
// //     activeTab: 'checkout',
// //   })
// // }
