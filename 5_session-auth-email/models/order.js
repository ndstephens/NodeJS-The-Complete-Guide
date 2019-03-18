const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
    },
  ],
  user: {
    name: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
})

module.exports = mongoose.model('Order', orderSchema)
