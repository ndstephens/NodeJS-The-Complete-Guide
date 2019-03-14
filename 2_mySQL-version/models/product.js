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
  constructor({ title, imageUrl, price, description } = {}) {
    this.title = title.trim()
    this.imageUrl = imageUrl.trim() || 'https://picsum.photos/300/300/?random'
    this.price = parseFloat(price).toFixed(2) || '0.00'
    this.description = description.trim()
    // this.id = id
  }

  // Also used for updating
  save() {
    return db.execute(
      'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageUrl]
    )
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
