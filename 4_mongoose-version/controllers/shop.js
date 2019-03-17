const Product = require('../models/product')
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
    .catch(err => console.log(err))
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
    .catch(err => console.log(err))
}

// exports.getProduct = (req, res, next) => {
//   Product.findById(req.params.productId)
//     .then(product => {
//       res.render('shop/product-detail', {
//         pageTitle: 'Product Detail',
//         activeTab: 'products',
//         product,
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.getCart = (req, res, next) => {
//   User.getCart(req.user)
//     .then(products => {
//       res.render('shop/cart', {
//         pageTitle: 'Cart',
//         activeTab: 'cart',
//         products,
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.postCart = (req, res, next) => {
//   User.addToCart(req.body.productId, req.user)
//     .then(() => res.redirect('/cart'))
//     .catch(err => console.log(err))
// }

// exports.postCartDeleteItem = (req, res, next) => {
//   User.deleteItemFromCart(req.body.productId, req.user)
//     .then(() => res.redirect('/cart'))
//     .catch(err => console.log(err))
// }

// exports.getOrders = (req, res, next) => {
//   User.getOrders(req.user)
//     .then(orders => {
//       res.render('shop/orders', {
//         pageTitle: 'Orders',
//         activeTab: 'orders',
//         orders,
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.postOrder = (req, res, next) => {
//   User.addOrder(req.user)
//     .then(() => res.redirect('/orders'))
//     .catch(err => console.log(err))
// }

// // exports.getCheckout = (req, res, next) => {
// //   res.render('shop/checkout', {
// //     pageTitle: 'Checkout',
// //     activeTab: 'checkout',
// //   })
// // }
