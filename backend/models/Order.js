const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled'], default: 'pending' },
    payment: {
      transactionId: { type: String, default: '' },
      mpesaReceiptNumber: { type: String, default: '' },
      checkoutRequestId: { type: String, default: '' },
      merchantRequestId: { type: String, default: '' },
      paidAt: { type: Date },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
