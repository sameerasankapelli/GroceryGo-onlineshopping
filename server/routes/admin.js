const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');

// Dashboard statistics
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      ordersByStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin)
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', protect, admin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all categories
router.get('/categories', protect, admin, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category
router.post('/categories', protect, admin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;