const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [String],
  unit: { type: String, required: true },
  stock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

productSchema.pre('save', function(next) {
  if (!this.isModified('name') && this.slug) return next();
  this.slug = slugify(`${this.name}`);
  next();
});

module.exports = mongoose.model('Product', productSchema);
