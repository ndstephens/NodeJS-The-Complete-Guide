const Product = require('../models/product')

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
}

exports.postCartDeleteItem = (req, res, next) => {
  const { productId } = req.body
  req.user
    .getCart()
    .then(cart => cart.getProducts({ where: { id: productId } }))
    .then(([product = undefined] = []) => {
      return product.cartItem.destroy()
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        activeTab: 'orders',
        orders,
      })
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder().then(order => {
        return order.addProducts(
          products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product
          })
        )
      })
    })
    .then(() => fetchedCart.setProducts(null))
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    activeTab: 'checkout',
  })
}
