const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  unit:        { type: String, enum: ['kg', 'bundle', 'tray', 'litre', 'piece', 'bag', 'sack', 'crate', 'bunch', '500ml', 'gram', 'dozen'], default: 'kg' },
  quantity:    { type: Number, required: true, min: 0 },
  category:    { type: String, required: true, enum: ['Vegetables', 'Fruits', 'Grains', 'Poultry', 'Dairy', 'Others'] },
  image:       { type: String, default: '' },
  farmer:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location:    { type: String, default: '' },
  phone:       { type: String, required: true },
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
