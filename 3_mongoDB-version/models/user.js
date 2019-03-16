const mongodb = require('mongodb')
const { getDb } = require('../utils/database')

class User {
  constructor(name, email, cart) {
    this._id = null
    this.name = name.trim()
    this.email = email.trim()
    this.cart = cart || { items: [] }
  }

  save() {
    const db = getDb()
    return db.collection('users').insertOne(this)
  }

  static addToCart(productId, user) {
    const db = getDb()

    const itemIndex = user.cart.items.findIndex(item => {
      return item.productId === productId
    })

    if (itemIndex === -1) {
      // item not found, add to cart w/ quantity of 1
      user.cart.items.push({ productId, quantity: 1 })
    } else {
      user.cart.items[itemIndex].quantity++
    }

    const { _id, ...rest } = user
    return db.collection('users').updateOne({ _id }, { $set: rest })
  }

  static findById(id) {
    const db = getDb()
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) })
  }
}

module.exports = User
