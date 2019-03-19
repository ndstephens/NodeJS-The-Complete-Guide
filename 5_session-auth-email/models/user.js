const Product = require('./product')

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
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
userSchema.methods.getCart = async function() {
  // Create copy of user's cart items
  let updatedCartItems = [...this.cart.items]
  // Loop through items, check if item/product still exists...
  for (const { productId } of this.cart.items) {
    await Product.findById(productId)
      .then(result => {
        // If not, remove from list
        if (!result) {
          updatedCartItems = updatedCartItems.filter(
            i => i.productId !== productId
          )
        }
      })
      .catch(err => console.log(err))
  }
  // If lengths are different (items were removed)...
  if (updatedCartItems.length !== this.cart.items.length) {
    // Update cart, save/update user
    this.cart.items = updatedCartItems
    await this.save()
  }

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

//* ========= CLEAR CART ==========
userSchema.methods.clearCart = function() {
  this.cart.items = []
  return this.save()
}

//
//* CREATE / EXPORT MODEL
module.exports = mongoose.model('User', userSchema)
