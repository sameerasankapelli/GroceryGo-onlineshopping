const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Image mapping with working URLs
const IMAGE_MAP = {
  "Apple": "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Banana": "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Tomato": "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Potato": "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Onion": "https://5.imimg.com/data5/SELLER/Default/2022/3/PR/KH/NZ/82043729/a-grade-red-onion-250x250.jpg",
  "Carrot": "https://images.pexels.com/photos/3650647/pexels-photo-3650647.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Spinach": "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cucumber": "https://purepng.com/public/uploads/large/purepng.com-cucumbercucumbervegetablespicklegreenfoodhealthycucumbers-481522161925n6wbx.png",
  "Mango": "https://tse4.mm.bing.net/th/id/OIP.E7aTO5DwiO6dlj3hh18y8wHaEo?pid=Api&P=0&h=180",
  "Orange": "https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Grapes": "https://images.pexels.com/photos/23042/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
  "Pomegranate": "https://media6.ppl-media.com/mediafiles/blogs/pomegranate_78d63b59c0.webp",
  "Papaya": "https://tse4.mm.bing.net/th/id/OIP.9D3b-ICYtmvbhu1cJ46JmAHaE7?pid=Api&P=0&h=180https://images.pexels.com/photos/5966466/pexels-photo-5966466.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cauliflower": "https://cdn.britannica.com/27/78227-050-28A68F87/cauliflower-Head-colour-White-brown-cultivars.jpg",
  "Cabbage": "https://m.media-amazon.com/images/I/61o2psqt4JL._AC_UF1000,1000_QL80_.jpg",
  "Milk": "https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Curd": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-tea6OFM6KiTDwMe0ENPjf4cqmITvakWuxw&s",
  "Paneer": "https://newsmeter.in/h-upload/2025/02/13/394708-20250213175015.webp",
  "Cheese": "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Butter": "https://img.freepik.com/free-vector/butter_1308-18709.jpg?semt=ais_hybrid&w=740&q=80",
  "Ghee": "https://cdn.shopify.com/s/files/1/0586/8234/3501/files/cow_desi_ghee_image.webp?v=1742634983",
  "Bread": "https://90degrees.in/cdn/shop/files/1copy_de20fde9-7283-46c1-826c-23eb28e3ee30.jpg?v=1689306365",
  "Brown Bread": "https://5.imimg.com/data5/SELLER/Default/2024/4/414340472/QZ/JF/AI/34064292/brown-sandwiche-bread.jpg",
  "Bun": "https://www.backerhausveit.com/wp-content/uploads/2021/03/45113-1.jpg",
  "Yogurt": "https://thumbs.dreamstime.com/b/bowl-greek-yogurt-fresh-berries-isolated-white-background-79866682.jpg",
  "Cream": "https://st.depositphotos.com/1031062/3183/i/450/depositphotos_31839883-stock-photo-sour-cream.jpg",
  "Cottage Cheese": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv8QEvCX8xNvyIpRaBp5qZhRe05XERCzPLQg&s",
  "Rusk": "https://t4.ftcdn.net/jpg/01/99/66/93/360_F_199669373_H6bzTj2BbEYeXplCwGIhw9xkSS0RKbsR.jpg",
  "Croissant": "https://www.theflavorbender.com/wp-content/uploads/2020/05/French-Croissants-SM-2363.jpg",
  "Bagel": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjsmKCpoyMt5YaxRdTeWTtgqt1jv-HTTgk7A&s",
  "Potato Chips": "https://images.pexels.com/photos/1893555/pexels-photo-1893555.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Nachos": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2obal5MBOPAD6Rth847a8rfXDh4kBl3hN3g&s",
  "Cookies": "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Chocolate": "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Coca Cola": "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Pepsi": "https://t4.ftcdn.net/jpg/02/84/65/61/360_F_284656175_G6SlGTBVl4pg8oXh6jr86cOmKUZjfrym.jpg",
  "Sprite": "https://t3.ftcdn.net/jpg/02/86/26/86/360_F_286268644_FJxZ9RW8bXWWiaZgKajwnwEZ61ynkfOp.jpg",
  "Orange Juice": "https://cdn.healthyrecipes101.com/recipes/images/juices/how-make-orange-juice-clambdipf00b9pw1b7tnqgdf6.webp",
  "Mango Juice": "https://t3.ftcdn.net/jpg/01/87/65/02/360_F_187650225_yiZwjK4HjPVxlD8npzCRUuaoodF39Kby.jpg",
  "Green Tea": "https://img.freepik.com/free-photo/leaf-plate-wood-object-healthy-eating_1172-451.jpg?semt=ais_hybrid&w=740&q=80",
  "Black Tea": "https://thumbs.dreamstime.com/b/glass-cup-black-tea-white-background-file-contains-clipping-path-400277830.jpg",
  "Coffee": "https://t3.ftcdn.net/jpg/03/15/40/34/360_F_315403482_MVo1gSOOfvwCwhLZ9hfVSB4MZuQilNrx.jpg",
  "Energy Drink": "https://img.freepik.com/free-vector/realistic-energy-drink-advertisement_23-2148154681.jpg?semt=ais_hybrid&w=740&q=80",
  "Soda": "https://cdn.prod.website-files.com/5cdb255abc2719f0c11a46e8/682f69c4435561f7fd314087_SODA_Can_montage_Apple2-removebg-preview.png",
  "Popcorn": "https://png.pngtree.com/png-clipart/20250103/original/pngtree-watch-movie-popcorn-maker-snack-foods-png-image_18726224.png",
  "Shampoo": "https://images-static.nykaa.com/media/catalog/product/9/0/901857b8901030704680_1.jpg?tr=w-500",
  "Conditioner": "https://www.tresemme.in/cdn/shop/files/26215_S2-8909106001473.jpg?v=1717658630&width=500",
  "Body Wash": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYzLqp2qlOMItHQgO7e8LytE-5miyNkQnj7A&s",
  "Face Wash": "https://images-static.nykaa.com/media/catalog/product/8/6/86174ee5011451103863_1.jpg",
  "Toothpaste": "https://www.quickpantry.in/cdn/shop/files/ColgateMaxFreshSpicyFreshToothpasteQuickPantry.jpg?v=1751026440&width=1214",
  "Toothbrush": "https://m.media-amazon.com/images/I/519wQs9qxEL.jpg",
  "Deodorant": "https://t3.ftcdn.net/jpg/05/47/09/94/360_F_547099407_S2EynnZIJkejvsxgGErZNlcn3DQ39pAC.jpg",
  "Soap": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTljFVuGhxdafzE9b0hRI2xmFL4RdX9TFIblA&s",
  "Handwash": "https://m.media-amazon.com/images/I/51tYPygTuTL.jpg",
  "Moisturizer": "https://images.mamaearth.in/catalog/product/g/e/gel-face-moisturizer.jpg?format=auto&height=600&width=600",
  "Hair Oil": "https://m.media-amazon.com/images/I/71FlO3G++cL._AC_UF1000,1000_QL80_.jpg",
  "Face Cream": "https://d1ebdenobygu5e.cloudfront.net/media/catalog/product/d/e/deepnourishingfacecreamb.jpg",
  "Sunscreen": "https://joypersonalcare.com/cdn/shop/files/Dry_Touch_SPF50_50ml_1500X1500_08f92e3f-5ea6-41e2-9dc8-09f96646fe52.jpg?v=1747218444",
  "Lip Balm": "https://www.soultree.in/cdn/shop/products/LIPBALM-02_09d47374-f182-4862-b0eb-7633bfacdfa0.jpg?v=1661773552",
  "Shaving Foam": "http://www.bombayshavingcompany.com/cdn/shop/products/CoffeeShavingFoam.jpg?v=1673863458",
  "Dish Soap": "https://i5.walmartimages.com/asr/710ec464-7f44-4559-a1d1-d60b7f84851c.9310b01bb988009d3271209df5d3c07a.png",
  "Laundry Detergent": "https://i5.walmartimages.com/asr/9a67169a-0cc3-4d1a-883b-f5602ae2ae42.171cfa82a0a4f39a6472e8b2fe2c4740.jpeg",
  "Floor Cleaner": "https://www.thespruce.com/thmb/fpIXsSg-BC7aOPh7bVwws0n4hYM=/fit-in/1000x1000/filters:no_upscale():max_bytes(150000):strip_icc()/654ce163-96ed-472a-b71f-de4f7b4c97bd_1.0e8e12b88700cd26d22a22bbb05c45f41-2aae14d1bc904ffb8e91203f44eceec6.jpeg",
  "Glass Cleaner": "https://i5.walmartimages.com/asr/429a10bf-f3d4-4c84-a611-03759c37b830_1.dd15e317380b5bdaace57a9bc8a5d14a.jpeg",
  "Toilet Cleaner": "https://uat.apollopharmacy.in/pub/media/catalog/product/t/c/tc.jpg",
  "Air Freshener": "https://m.media-amazon.com/images/I/71-t4UTRvcL._SL1500_.jpg",
  "Garbage Bags": "https://m.media-amazon.com/images/I/81Vn5IFvRSL.jpg",
  "Scrub Pad": "https://m.media-amazon.com/images/I/71oaRd6a+-L._AC_SL1000_.jpg",
  "Sponge": "https://m.media-amazon.com/images/I/71aOnw8N3sL._AC_SL1500_.jpg",
  "Mop": "https://tse3.mm.bing.net/th/id/OIP.A9QiG3CnPugIIWHLt0-w9QHaLM?pid=Api&P=0&h=180",
  "Broom": "https://tse4.mm.bing.net/th/id/OIP.FjASXoCx16ZsweJkcPrnQAHaFj?pid=Api&P=0&h=180",
  "Tissue Paper": "https://factori.com/assets/img/Tissue-Paper-3.jpeg",
  "Aluminium Foil": "https://m.media-amazon.com/images/I/61Tds6hPveL._AC_.jpg",
  "Cling Film": "https://m.media-amazon.com/images/I/71mpyd4u60L._AC_SX679_.jpg",
  "Matchbox": "https://cdn.pixabay.com/photo/2015/01/11/14/36/matches-596304_1280.jpg",
  "Baby Diapers": "https://i5.walmartimages.com/asr/bf2ee3c9-4f69-49e6-affe-5c5ee3d1f17e_1.d88379b2c5271a3dff12a83fd284f06b.jpeg",
  "Baby Wipes": "https://i5.walmartimages.com/seo/Pampers-Sensitive-Baby-Wipes-1X-Flip-Top-Pack-84-Wipes-Select-for-More-Options_a0728663-875d-45c5-85c1-1e1b5c67f065.cf2dd472eb92d0d69c6f03c319a511f3.jpeg",
  "Baby Lotion": "https://www.banglashoppers.com/media/catalog/product/cache/94c7ae6973bcda334d345b17b63697ea/j/_/j_j_-_moisturizing_pink_baby_lotion_with_coconut_oil_-_500ml.jpg",
  "Baby Powder": "https://m.media-amazon.com/images/I/61U3XjRzopL.jpg",
  "Baby Soap": "https://tse4.mm.bing.net/th/id/OIP.eWBko9vLnpZRrAuCmzpQiAHaE1?pid=Api&P=0&h=180",
  "Baby Shampoo": "https://countrymedicalpharmacy.com/wp-content/uploads/2024/05/51LMdpnV5lL.jpg",
  "Feeding Bottle": "http://cdn.firstcry.com/brainbees/images/products/zoom/72098a.jpg",
  "Baby Oil": "https://i5.walmartimages.com/seo/JOHNSON-S-Baby-Oil-14-oz-Pack-of-4_777a1477-e659-4f8b-80c0-a1a93140eb67_1.38f929ad6d25b1e544c85cd985865ba1.jpeg",
  "Baby Cream": "https://s.ecrater.com/stores/266289/5d9ae3b01d857_266289b.jpg",
  "Baby Wash": "https://assets.unileversolutions.com/v1/2150503.png",
  "Rash Cream": "https://i5.walmartimages.com/seo/De-La-Cruz-Baby-Diaper-Rash-Cream-with-40-Zinc-Oxide-Vitamin-E-3-4-Oz_2d4011f7-92a6-41ef-ac59-3473ad1f44d4.a5de091487ef2fa949e3e79dcd677ed6.jpeg",
  "Baby Food": "https://i5.walmartimages.com/seo/Gerber-2nd-Foods-Mealtime-for-Baby-Baby-Food-Chicken-Gravy-2-5-oz-Jar_fc60da9d-4241-46d0-84ca-0c6842220f5d.f590c52b938b7f0bbd1f881a24a22b98.jpeg",
  "Teether": "https://m.media-amazon.com/images/I/71dasyGxH4L._AC_.jpg",
  "Pacifier": "https://www.parents.com/thmb/wuvW77wnEjs4jaEdBVMu7cEa2ak=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Tommee-Tippee-Pick-a-Paci-Baby-Pacifier-Collection-293ed3616634452ba536863ee1cf6d65.png",
  "Baby Blanket": "https://cdn.mycrafts.com/i/1/1/4/very-easy-crochet-baby-blanket-dit-o.jpg"
};

// Function to extract base name (removes variant words)
function getBaseName(productName) {
  // Remove variant words like Premium, Organic, etc.
  const variantWords = ['Premium', 'Organic', 'Classic', 'Select', 'Fresh', 'Daily', 'Gold', 'Choice', 'Natural', 'Prime', 'Pure'];
  let baseName = productName;
  variantWords.forEach(variant => {
    const regex = new RegExp(`\\s*${variant}\\s*$`, 'i');
    baseName = baseName.replace(regex, '').trim();
  });
  return baseName;
}

async function updateProductImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`Found ${products.length} products in database\n`);

    let updated = 0;
    let notFound = 0;

    for (const product of products) {
      const baseName = getBaseName(product.name);
      
      // Try exact match first
      let imageUrl = IMAGE_MAP[product.name];
      
      // Try base name if exact match fails
      if (!imageUrl) {
        imageUrl = IMAGE_MAP[baseName];
      }

      if (imageUrl) {
        await Product.findByIdAndUpdate(product._id, {
          images: [imageUrl]
        });
        console.log(`✅ Updated: ${product.name} → ${baseName}`);
        updated++;
      } else {
        console.log(`❌ No image found for: ${product.name} (base: ${baseName})`);
        notFound++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updated} products`);
    console.log(`   ❌ Not found: ${notFound} products`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    console.log('Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateProductImages();