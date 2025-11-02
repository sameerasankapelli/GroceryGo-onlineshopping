const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    let query = Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    if (limit) query = query.limit(limit);
    
    const orders = await query;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;