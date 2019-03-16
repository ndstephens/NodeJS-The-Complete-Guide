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

    // check if item already exists in cart, get index
    const itemIndex = user.cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    )

    if (itemIndex === -1) {
      // item not found, add to cart w/ quantity of 1
      user.cart.items.push({
        productId: new mongodb.ObjectId(productId),
        quantity: 1,
      })
    } else {
      // item found, add '1' to quantity
      user.cart.items[itemIndex].quantity++
    }

    const { _id, ...rest } = user
    return db.collection('users').updateOne({ _id }, { $set: rest })
  }

  static getCart(user) {
    const db = getDb()
    const productIds = user.cart.items.map(item => item.productId)
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(product => ({
          ...product,
          quantity: user.cart.items.find(
            item => item.productId.toString() === product._id.toString()
          ).quantity,
        }))
      })
  }

  static findById(id) {
    const db = getDb()
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) })
  }
}

module.exports = User
