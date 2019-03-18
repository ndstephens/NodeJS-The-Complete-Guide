const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    cart: {
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
)

//* ========= ADD TO CART ==========
userSchema.methods.addToCart = function(productId) {
  const updatedCartItems = [...this.cart.items]
  // check if item already exists in cart, get index
  const itemIndex = this.cart.items.findIndex(
    item => item.productId.toString() === productId.toString()
  )
  if (itemIndex === -1) {
    // item not found, add to cart w/ quantity of 1
    updatedCartItems.push({
      productId: productId,
      quantity: 1,
    })
  } else {
    // item found, add '1' to quantity
    updatedCartItems[itemIndex].quantity++
  }

  this.cart.items = updatedCartItems
  return this.save()
}

//* ========= GET CART ==========
userSchema.methods.getCart = function() {
  return this.populate('cart.items.productId').execPopulate()
}

//* ========= DELETE FROM CART ==========
userSchema.methods.deleteFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(
    item => item.productId.toString() !== productId.toString()
  )

  this.cart.items = updatedCartItems
  return this.save()
}

//
//* CREATE / EXPORT MODEL
module.exports = mongoose.model('User', userSchema)

// const mongodb = require('mongodb')
// const { getDb } = require('../utils/database')

// class User {
//   constructor(name, email, cart) {
//     this._id = null
//     this.name = name.trim()
//     this.email = email.trim()
//     this.cart = cart || { items: [] }
//   }

//   save() {
//     const db = getDb()
//     return db.collection('users').insertOne(this)
//   }

//   static findById(id) {
//     const db = getDb()
//     return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) })
//   }

//   static getCart(user) {
//     const db = getDb()
//     const productIds = user.cart.items.map(item => item.productId)
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(product => ({
//           ...product,
//           quantity: user.cart.items.find(
//             item => item.productId.toString() === product._id.toString()
//           ).quantity,
//         }))
//       })
//   }

//   static addToCart(productId, user) {
//     const db = getDb()
//     const updatedCartItems = [...user.cart.items]

//     // check if item already exists in cart, get index
//     const itemIndex = user.cart.items.findIndex(
//       item => item.productId.toString() === productId.toString()
//     )

//     if (itemIndex === -1) {
//       // item not found, add to cart w/ quantity of 1
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(productId),
//         quantity: 1,
//       })
//     } else {
//       // item found, add '1' to quantity
//       updatedCartItems[itemIndex].quantity++
//     }

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: user._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//   }

//   static deleteItemFromCart(productId, user) {
//     const db = getDb()

//     const updatedCartItems = user.cart.items.filter(
//       item => item.productId.toString() !== productId.toString()
//     )

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: user._id },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//   }

//   static getOrders(user) {
//     const db = getDb()

//     return db
//       .collection('orders')
//       .find({ 'user._id': user._id })
//       .toArray()
//   }

//   static addOrder(user) {
//     const db = getDb()

//     return this.getCart(user)
//       .then(products => {
//         return db.collection('orders').insertOne({
//           items: products,
//           user: {
//             _id: user._id,
//             name: user.name,
//           },
//         })
//       })
//       .then(() => {
//         // user.cart = { items: [] }
//         return db
//           .collection('users')
//           .updateOne({ _id: user._id }, { $set: { cart: { items: [] } } })
//       })
//   }
// }

// module.exports = User
