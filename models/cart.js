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

  static addProduct(product) {
    getCartFromFile(cart => {
      // Analyze cart -> find existing product
      const existingProduct = cart.products.find(p => p.id === product.id)
      // Add or update product
      if (existingProduct) {
        existingProduct.qty++
      } else {
        cart.products.push({ ...product, qty: 1 })
      }
      // Update cart's totalPrice
      cart.totalPrice = this.updateTotalPrice(cart)

      // Update the cart JSON file
      fs.writeFile(cartPath, JSON.stringify(cart), err => console.log(err))
    })
  }

  static updateCartItem(updatedProduct) {
    getCartFromFile(cart => {
      // if cart contains a product that was updated, then update it in the cart
      if (cart.products.some(p => p.id === updatedProduct.id)) {
        cart.products.forEach((product, i) => {
          if (product.id === updatedProduct.id) {
            cart.products[i] = { ...product, ...updatedProduct }
          }
        })
        cart.totalPrice = this.updateTotalPrice(cart)
        fs.writeFile(cartPath, JSON.stringify(cart), err => console.log(err))
      }
    })
  }
}
