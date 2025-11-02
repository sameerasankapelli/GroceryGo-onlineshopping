const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: String,
  image: String,
  isActive: { type: Boolean, default: true },
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

categorySchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model('Category', categorySchema);
