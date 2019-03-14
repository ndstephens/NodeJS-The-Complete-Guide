// const fs = require('fs')
// const path = require('path')

// const uuidv4 = require('uuid/v4')
// const rootDir = require('../utils/rootDir')

// const prodPath = path.join(rootDir, 'data', 'products.json')

// const getProductsFromFile = cb => {
//   fs.readFile(prodPath, (err, data) => {
//     if (err) {
//       cb([])
//     } else {
//       cb(JSON.parse(data.toString()))
//     }
//   })
// }

const db = require('../utils/database')

module.exports = class Product {
  constructor({ title, imageUrl, price, desc, id } = {}) {
    this.title = title.trim()
    this.imageUrl = imageUrl.trim() || 'https://picsum.photos/300/300/?random'
    this.price = parseFloat(price).toFixed(2) || '0.00'
    this.desc = desc.trim()
    this.id = id
  }

  // Also used for updating
  save(cb) {
    // getProductsFromFile(products => {
    //   // check if product instance calling this method already exists (and is attempting an update)
    //   const productIndex = products.findIndex(p => p.id === this.id)
    //   if (productIndex !== -1) {
    //     // if found, update product
    //     products[productIndex] = this
    //   } else {
    //     // otherwise add new Product to list
    //     products.push(this)
    //   }
    //   fs.writeFile(prodPath, JSON.stringify(products), err => cb(err))
    // })
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products')
  }

  static findById(id, cb) {
    // getProductsFromFile(products => {
    //   const product = products.find(p => p.id === id)
    //   cb(product)
    // })
  }

  static deleteById(id, cb) {
    // getProductsFromFile(products => {
    //   const filteredProducts = products.filter(p => p.id !== id)
    //   fs.writeFile(prodPath, JSON.stringify(filteredProducts), err => cb(err))
    // })
  }
}
