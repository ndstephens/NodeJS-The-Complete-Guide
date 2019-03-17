const mongodb = require('mongodb')
const { getDb } = require('../utils/database')

class Product {
  constructor({ title, price, description, imageUrl, id, userId } = {}) {
    this._id = id ? new mongodb.ObjectId(id) : null
    this.title = title.trim()
    this.price = parseFloat(price).toFixed(2) || 0.0
    this.description = description.trim()
    this.imageUrl = imageUrl || 'https://picsum.photos/300/300/?random'
    this.userId = userId
  }

  save() {
    const db = getDb()
    if (this._id) {
      // UPDATE PRODUCT
      const { _id, ...rest } = this
      return db.collection('products').updateOne({ _id }, { $set: rest })
    } else {
      // CREATE NEW PRODUCT
      return db.collection('products').insertOne(this)
    }
  }

  static fetchall() {
    const db = getDb()
    return db
      .collection('products')
      .find()
      .toArray()
  }

  static findById(id) {
    const db = getDb()
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
  }

  static deleteById(id) {
    const db = getDb()
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(id) })
  }
}

module.exports = Product
