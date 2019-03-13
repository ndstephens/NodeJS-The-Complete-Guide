const fs = require('fs')
const path = require('path')

const rootDir = require('../utils/rootDir')

const cartPath = path.join(rootDir, 'data', 'cart.json')

module.exports = class Cart {
  static addProduct(product) {
    // Fetch previous cart
    fs.readFile(cartPath, (err, data) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(data.toString())
      }
      // Analyze cart -> find existing product
      const existingProduct = cart.products.find(p => p.id === product.id)
      // Add or update product
      if (existingProduct) {
        existingProduct.qty++
      } else {
        cart.products.push({ ...product, qty: 1 })
      }
      // Update cart's totalPrice
      cart.totalPrice = cart.products.reduce((total, prod) => {
        return total + +prod.price * prod.qty
      }, 0)
      // Update the cart JSON file
      fs.writeFile(cartPath, JSON.stringify(cart), err => console.log(err))
    })
  }
}
