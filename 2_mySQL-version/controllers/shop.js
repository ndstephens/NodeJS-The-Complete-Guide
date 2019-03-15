const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
    .then(products => {
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
  // Product.findAll({ where: { id: productId } }) // returns array
  Product.findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: 'Product Detail',
        activeTab: 'products',
        product,
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts()
    })
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        activeTab: 'cart',
        products,
      })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const { id: productId } = JSON.parse(req.body.product)
  let fetchedCart
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: productId } })
    })
    .then(([product = undefined] = []) => {
      if (!product) {
        return Product.findByPk(productId).then(product => {
          return fetchedCart.addProduct(product, {
            through: { quantity: 1 },
          })
        })
      }
      const { quantity: qty } = product.cartItem
      return fetchedCart.addProduct(product, {
        through: { quantity: qty + 1 },
      })
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))

  // Cart.addProduct(product, err => {
  //   if (err) {
  //     next()
  //   } else {
  //     res.redirect('/cart')
  //   }
  // })
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
