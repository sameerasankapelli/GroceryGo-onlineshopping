const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

dotenv.config();
const PIXABAY_KEY = process.env.PIXABAY_API_KEY || process.env.PIXABAY_KEY || '';
let IMAGE_OVERRIDES = {};
try {
  const p = path.join(__dirname, 'image_overrides.json');
  if (fs.existsSync(p)) {
    IMAGE_OVERRIDES = JSON.parse(fs.readFileSync(p, 'utf8'));
  }
} catch { /* ignore */ }

// Local downloads directory (served by express as /uploads)
const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function downloadToFile(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.promises.writeFile(destPath, buf);
    return true;
  } catch {
    return false;
  }
}

const categories = [
  { name: 'Fruits & Vegetables', description: 'Fresh fruits and vegetables', image: 'fruits.jpg' },
  { name: 'Dairy & Bakery', description: 'Milk, cheese, bread, and more', image: 'dairy.jpg' },
  { name: 'Snacks & Beverages', description: 'Chips, drinks, and snacks', image: 'snacks.jpg' },
  { name: 'Personal Care', description: 'Personal hygiene products', image: 'personal.jpg' },
  { name: 'Household', description: 'Cleaning and household items', image: 'household.jpg' },
  { name: 'Baby Care', description: 'Baby products and essentials', image: 'baby.jpg' }
];

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

const unitsByCategory = {
  'Fruits & Vegetables': ['250 g', '500 g', '1 kg'],
  'Dairy & Bakery': ['200 g', '500 g', '1 liter', '1 loaf'],
  'Snacks & Beverages': ['100 g', '250 g', '500 ml', '1 liter'],
  'Personal Care': ['100 ml', '250 ml', '500 ml'],
  'Household': ['250 ml', '500 ml', '1 kg'],
  'Baby Care': ['Pack of 20', 'Pack of 50', 'Pack of 80']
};

const sampleNamesByCategory = {
  'Fruits & Vegetables': ['Apple', 'Banana', 'Tomato', 'Potato', 'Onion', 'Carrot', 'Spinach', 'Cucumber', 'Mango', 'Orange', 'Grapes', 'Pomegranate', 'Papaya', 'Cauliflower', 'Cabbage', 'Broccoli', 'Green Peas', 'Lemon'],
  'Dairy & Bakery': ['Milk', 'Curd', 'Paneer', 'Cheese', 'Butter', 'Ghee', 'Bread', 'Brown Bread', 'Bun', 'Yogurt', 'Cream', 'Cottage Cheese', 'Rusk', 'Croissant', 'Bagel'],
  'Snacks & Beverages': ['Potato Chips', 'Nachos', 'Cookies', 'Chocolate', 'Coca Cola', 'Pepsi', 'Sprite', 'Orange Juice', 'Mango Juice', 'Green Tea', 'Black Tea', 'Coffee', 'Energy Drink', 'Soda', 'Popcorn', 'Mixture'],
  'Personal Care': ['Shampoo', 'Conditioner', 'Body Wash', 'Face Wash', 'Toothpaste', 'Toothbrush', 'Deodorant', 'Soap', 'Handwash', 'Moisturizer', 'Hair Oil', 'Face Cream', 'Sunscreen', 'Lip Balm', 'Shaving Foam'],
  'Household': ['Dish Soap', 'Laundry Detergent', 'Floor Cleaner', 'Glass Cleaner', 'Toilet Cleaner', 'Air Freshener', 'Garbage Bags', 'Scrub Pad', 'Sponge', 'Mop', 'Broom', 'Tissue Paper', 'Aluminium Foil', 'Cling Film', 'Matchbox'],
  'Baby Care': ['Baby Diapers', 'Baby Wipes', 'Baby Lotion', 'Baby Powder', 'Baby Soap', 'Baby Shampoo', 'Feeding Bottle', 'Baby Oil', 'Baby Cream', 'Baby Wash', 'Rash Cream', 'Baby Food', 'Teether', 'Pacifier', 'Baby Blanket']
};

const variantWords = ['Premium','Organic','Classic','Select','Fresh','Daily','Gold','Choice','Natural','Prime','Pure'];

const stripTrailingNumber = (str) => String(str).replace(/\s+\d+$/,'');
const hashCode = (s) => {
  let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
};
const imageFor = (category, name, idx) => {
  const base = stripTrailingNumber(name);
  const keywords = `${base} ${category}`.toLowerCase().replace(/[^a-z0-9\s]/g,'').trim().replace(/\s+/g,',');
  const lock = hashCode(`${category}-${base}-${idx}`);
  // Deterministic, keyword-relevant fallback image (used if Pixabay is unavailable)
  return `https://loremflickr.com/600/600/${encodeURIComponent(keywords)}?lock=${lock}`;
};

async function pixabayImage(category, name, idx, seen) {
  if (!PIXABAY_KEY) return null;
  const base = stripTrailingNumber(name).toLowerCase();
  const token = base.split(' ')[0];
  // Override map takes precedence (exact or first token)
  if (IMAGE_OVERRIDES[base]) return IMAGE_OVERRIDES[base];
  if (IMAGE_OVERRIDES[token]) return IMAGE_OVERRIDES[token];

  // Category-specific keywords to improve relevance
  const extrasByCategory = {
    'Fruits & Vegetables': 'fresh produce, isolated',
    'Dairy & Bakery': 'packaged, dairy, bakery',
    'Snacks & Beverages': 'packaged snack, drink',
    'Personal Care': 'bottle, hygiene product',
    'Household': 'cleaning product',
    'Baby Care': 'baby product, packaged'
  };
  const extras = extrasByCategory[category] || '';
  try {
    const q = encodeURIComponent(`${base} ${extras}`.trim());
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${q}&image_type=photo&per_page=20&safesearch=true&orientation=horizontal&min_width=600&min_height=600`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const hits = (data.hits || []);
    if (hits.length === 0) return null;
    // Pick a stable index based on hash, avoid duplicates by stepping if needed
    let i = Math.abs(hashCode(base)) % hits.length;
    for (let step = 0; step < hits.length; step++) {
      const h = hits[(i + step) % hits.length];
      const candidate = h.largeImageURL || h.webformatURL || null;
      if (candidate && !seen.has(candidate)) {
        return candidate;
      }
    }
    return hits[0].largeImageURL || hits[0].webformatURL || null;
  } catch {
    return null;
  }
}

function generateProductsForCategory(categoryName, count = 15) {
  const names = sampleNamesByCategory[categoryName] || [];
  const units = unitsByCategory[categoryName] || ['1 unit'];
  const out = [];
  const usedNames = new Set();
  for (let i = 0; i < count; i++) {
    const baseName = names[i % names.length] || `${categoryName} Item`;
    let name = baseName;
    if (usedNames.has(name)) {
      const v = variantWords[(i + names.length) % variantWords.length];
      name = `${baseName} ${v}`;
    }
    usedNames.add(name);
    const basePrice = Math.floor(40 + Math.random() * 400);
    const discount = Math.random() < 0.6 ? Math.floor(basePrice * (0.8 + Math.random() * 0.15)) : undefined;
    const unit = units[i % units.length];
    out.push({
      name,
      description: `${name} - premium quality in ${unit}`,
      price: basePrice,
      discountPrice: discount,
      unit,
      stock: Math.floor(50 + Math.random() * 300),
      images: [imageFor(categoryName, name, i)],
      category: categoryName,
      isAvailable: true
    });
  }
  return out;
}

function buildAllProducts(minPerCategory = 15) {
  return categories.flatMap(c => generateProductsForCategory(c.name, minPerCategory));
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    const categoriesWithSlugs = categories.map(c => ({ ...c, slug: slugify(c.name) }));
    const insertedCategories = await Category.insertMany(categoriesWithSlugs);
    console.log('Categories seeded successfully');

    // Map category names to IDs and slugs
    const categoryIdByName = insertedCategories.reduce((acc, c) => { acc[c.name] = c._id; return acc; }, {});
    const categorySlugByName = insertedCategories.reduce((acc, c) => { acc[c.name] = c.slug || slugify(c.name); return acc; }, {});

    // Build products and convert category name to ObjectId and slug
    const generated = buildAllProducts(15);
    const seen = new Set();
    const productsWithCategoryIds = await Promise.all(generated.map(async (p, idx) => {
      const chosenImage = await pixabayImage(p.category, p.name, idx, seen);
      const remoteUrl = chosenImage || p.images?.[0] || imageFor(p.category, p.name, idx);
      if (remoteUrl) seen.add(remoteUrl);
      const slugSafe = slugify(`${categorySlugByName[p.category]}-${p.name}-${idx}`);
      const filePath = path.join(uploadsDir, `${slugSafe}.jpg`);
      const publicUrl = `/uploads/products/${slugSafe}.jpg`;
      let ok = false;
      if (remoteUrl) {
        ok = await downloadToFile(remoteUrl, filePath);
      }
      // Fallback to a generated keyword image saved locally if remote failed
      if (!ok) {
        const fallbackUrl = imageFor(p.category, p.name, idx);
        await downloadToFile(fallbackUrl, filePath);
      }
      return ({
        ...p,
        images: [publicUrl],
        slug: slugSafe,
        category: categoryIdByName[p.category]
      });
    }));

    await Product.insertMany(productsWithCategoryIds);
    console.log('Products seeded successfully');

    console.log(`\nSeeded ${insertedCategories.length} categories`);
    console.log(`Seeded ${productsWithCategoryIds.length} products (${Math.round(productsWithCategoryIds.length/insertedCategories.length)} per category)`);
    
    await mongoose.connection.close();
    console.log('\nDatabase seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
