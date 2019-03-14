const fs = require('fs')
const path = require('path')

const rootDir = require('../utils/rootDir')

const cartPath = path.join(rootDir, 'data', 'cart.json')

const getCartFromFile = cb => {
  fs.readFile(cartPath, 'utf8', (err, data) => {
    if (err) {
      cb({ products: [], totalPrice: 0 })
    } else {
      if (!data) {
        cb({ products: [], totalPrice: 0 })
      } else {
        cb(JSON.parse(data.toString()))
      }
    }
  })
}

module.exports = class Cart {
  static updateTotalPrice(cart) {
    return cart.products.reduce((total, prod) => {
      return total + +prod.price * prod.qty
    }, 0)
  }

  static getCartContents(cb) {
    getCartFromFile(cb)
  }

  static addProduct(product, cb) {
    getCartFromFile(cart => {
      // Find if product already exists in cart
      const existingProduct = cart.products.find(p => p.id === product.id)
      // If exists, update quantity, otherwise add to cart
      if (existingProduct) {
        existingProduct.qty++
      } else {
        cart.products.push({ ...product, qty: 1 })
      }
      // Update cart's totalPrice
      cart.totalPrice = this.updateTotalPrice(cart)
      // Update the cart JSON file
      fs.writeFile(cartPath, JSON.stringify(cart), err => cb(err))
    })
  }

  static updateCartItem(updatedProduct, cb) {
    getCartFromFile(cart => {
      // Check if cart contains item before attempting update
      if (cart.products.some(p => p.id === updatedProduct.id)) {
        cart.products.forEach((product, i) => {
          if (product.id === updatedProduct.id) {
            cart.products[i] = { ...product, ...updatedProduct }
          }
        })
        cart.totalPrice = this.updateTotalPrice(cart)
        fs.writeFile(cartPath, JSON.stringify(cart), err => cb(err))
      } else {
        cb()
      }
    })
  }

  static deleteCartItem(productId, cb) {
    getCartFromFile(cart => {
      // Check if cart contains item before attempting delete
      if (cart.products.some(p => p.id === productId)) {
        const updatedCart = {}
        updatedCart.products = cart.products.filter(p => p.id !== productId)
        updatedCart.totalPrice = this.updateTotalPrice(updatedCart)
        fs.writeFile(cartPath, JSON.stringify(updatedCart), err => cb(err))
      } else {
        cb()
      }
    })
  }
}
