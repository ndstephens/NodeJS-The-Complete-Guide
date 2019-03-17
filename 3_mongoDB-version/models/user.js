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

  static findById(id) {
    const db = getDb()
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) })
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

  static addToCart(productId, user) {
    const db = getDb()
    const updatedCartItems = [...user.cart.items]

    // check if item already exists in cart, get index
    const itemIndex = user.cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    )

    if (itemIndex === -1) {
      // item not found, add to cart w/ quantity of 1
      updatedCartItems.push({
        productId: new mongodb.ObjectId(productId),
        quantity: 1,
      })
    } else {
      // item found, add '1' to quantity
      updatedCartItems[itemIndex].quantity++
    }

    return db
      .collection('users')
      .updateOne(
        { _id: user._id },
        { $set: { cart: { items: updatedCartItems } } }
      )
  }

  static deleteItemFromCart(productId, user) {
    const db = getDb()

    const updatedCartItems = user.cart.items.filter(
      item => item.productId.toString() !== productId.toString()
    )

    return db
      .collection('users')
      .updateOne(
        { _id: user._id },
        { $set: { cart: { items: updatedCartItems } } }
      )
  }

  static addOrder(user) {
    const db = getDb()
    return db
      .collection('orders')
      .insertOne(user.cart)
      .then(() => {
        user.cart = { items: [] }
        return db
          .collection('users')
          .updateOne({ _id: user._id }, { $set: { cart: { items: [] } } })
      })
  }
}

module.exports = User
