const fs = require('fs')
const path = require('path')

const rootDir = require('../utils/rootDir')

const p = path.join(rootDir, 'data', 'products.json')

module.exports = class Product {
  constructor({ title = '', imageUrl = '', price = 0, desc = '' } = {}) {
    this.title = title.trim()
    this.imageUrl = imageUrl.trim()
    this.price = parseInt(price).toFixed(2)
    this.desc = desc.trim()
  }

  save() {
    fs.readFile(p, (err, data) => {
      let products = []
      if (!err) {
        products = JSON.parse(data.toString())
      }
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), err => console.log(err))
    })
  }

  static fetchAll(cb) {
    fs.readFile(p, (err, data) => {
      if (err) {
        cb([])
      } else {
        cb(JSON.parse(data.toString()))
      }
    })
  }
}
