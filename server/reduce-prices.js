const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Percentage to reduce prices by (e.g., 20 means reduce by 20%)
const REDUCTION_PERCENTAGE = 40;

async function reducePrices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    console.log(`\nReducing prices by ${REDUCTION_PERCENTAGE}%...\n`);

    let updated = 0;
    for (const product of products) {
      const oldPrice = product.price;
      const oldDiscountPrice = product.discountPrice;
      
      // Reduce price
      product.price = Math.round(oldPrice * (1 - REDUCTION_PERCENTAGE / 100));
      
      // Reduce discount price if it exists
      if (product.discountPrice) {
        product.discountPrice = Math.round(oldDiscountPrice * (1 - REDUCTION_PERCENTAGE / 100));
      }
      
      await product.save();
      updated++;
      
      console.log(`${product.name}: Rs.${oldPrice} -> Rs.${product.price}${oldDiscountPrice ? ` (Discount: Rs.${oldDiscountPrice} -> Rs.${product.discountPrice})` : ''}`);
    }

    console.log(`\nSuccessfully reduced prices for ${updated} products`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error reducing prices:', error);
    process.exit(1);
  }
}

reducePrices();
