const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Add review
router.post('/:productId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product reviews
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
