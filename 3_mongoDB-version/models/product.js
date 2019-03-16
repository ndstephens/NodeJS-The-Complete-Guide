const { getDb } = require('../utils/database')

class Product {
  constructor({ title, price, description, imageUrl } = {}) {
    this.title = title.trim()
    this.price = parseFloat(price).toFixed(2) || 0.0
    this.description = description.trim()
    this.imageUrl = imageUrl || 'https://picsum.photos/300/300/?random'
  }

  save() {
    const db = getDb()
    return db.collection('products').insertOne(this)
  }
}

module.exports = Product
