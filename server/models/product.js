const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  imageURL: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)