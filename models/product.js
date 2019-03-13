const fs = require('fs')
const path = require('path')

const uuidv4 = require('uuid/v4')
const rootDir = require('../utils/rootDir')

const p = path.join(rootDir, 'data', 'products.json')

module.exports = class Product {
  constructor({ title, imageUrl, price, desc } = {}) {
    this.title = title.trim()
    this.imageUrl = imageUrl.trim() || 'https://picsum.photos/300/300/?random'
    this.price = price || '0.00'
    this.desc = desc.trim()
    this.id = uuidv4()
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
