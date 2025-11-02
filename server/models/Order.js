const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentMethod: { type: String, enum: ['online', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  deliveryTime: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);