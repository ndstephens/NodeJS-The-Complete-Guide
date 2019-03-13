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

  static addProduct({ id, price } = {}) {
    getCartFromFile(cart => {
      // Analyze cart -> find existing product
      const existingProduct = cart.products.find(p => p.id === id)
      // Add or update product
      if (existingProduct) {
        existingProduct.qty++
      } else {
        cart.products.push({
          id,
          price,
          qty: 1,
        })
      }
      // Update cart's totalPrice
      cart.totalPrice = this.updateTotalPrice(cart)

      // Update the cart JSON file
      fs.writeFile(cartPath, JSON.stringify(cart), err => console.log(err))
    })
  }
}
