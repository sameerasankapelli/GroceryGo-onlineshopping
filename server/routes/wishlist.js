const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist
router.post('/add/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.wishlist.some(id => id.toString() === req.params.productId)) {
      user.wishlist.push(req.params.productId);
      await user.save();
    }
    
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(
      item => item.toString() !== req.params.productId
    );
    await user.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
