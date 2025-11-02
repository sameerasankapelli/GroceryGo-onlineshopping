const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, categorySlug, categoryName, search, limit } = req.query;
    let query = { isAvailable: true };

    // Resolve category filter by id, slug, or name
    if (category || categorySlug || categoryName) {
      let categoryId = null;
      if (category && mongoose.Types.ObjectId.isValid(category)) {
        categoryId = category;
      } else if (categorySlug) {
        const cat = await Category.findOne({ slug: categorySlug });
        categoryId = cat?._id;
      } else if (category) {
        // If "category" provided but not an ObjectId, treat as slug or name
        const cat = await Category.findOne({ $or: [{ slug: category }, { name: category }] });
        categoryId = cat?._id;
      } else if (categoryName) {
        const normalized = String(categoryName).trim();
        const cat = await Category.findOne({ name: { $regex: `^${normalized}$`, $options: 'i' } });
        categoryId = cat?._id;
      }
      if (categoryId) {
        query.category = categoryId;
      }
    }

    if (search) query.name = { $regex: search, $options: 'i' };

    let productsQuery = Product.find(query).populate('category');
    
    if (limit) productsQuery = productsQuery.limit(parseInt(limit));

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;