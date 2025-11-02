const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = 'completed';
    order.orderStatus = 'confirmed';

    await order.save();

    res.json({ message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;