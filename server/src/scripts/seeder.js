const mongoose = require('mongoose');
const Product = require('../features/product/product.model.js');
require('dotenv').config();

const brands = ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Realme'];
const types = ['Phone', 'Cover', 'Charger', 'Headphones'];
const adjectives = ['Pro', 'Max', 'Ultra', 'Lite', '5G', 'Plus'];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const generateProducts = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB...");

  const products = [];
  for (let i = 0; i < 1200; i++) {
    const brand = brands[randomInt(0, brands.length - 1)];
    const type = types[randomInt(0, types.length - 1)];
    const adj = adjectives[randomInt(0, adjectives.length - 1)];
    
    const title = `${brand} ${type} ${adj} ${randomInt(10, 20)}`;
    const mrp = randomInt(5000, 150000);
    const price = Math.floor(mrp * 0.8); // 20% discount

    products.push({
      title: title,
      description: `Best in class ${title} with ${randomInt(4, 12)}GB RAM.`,
      price: price,
      mrp: mrp,
      stock: randomInt(0, 50), // Some out of stock
      rating: (Math.random() * 2 + 3).toFixed(1), // Rating between 3.0 and 5.0
      salesCount: randomInt(100, 50000),
      returnRate: randomInt(1, 15),
      metadata: {
        color: ['Red', 'Blue', 'Black', 'White'][randomInt(0, 3)],
        storage: `${[64, 128, 256, 512][randomInt(0, 3)]}GB`
      }
    });
  }

  await Product.deleteMany({}); // Clear old data
  await Product.insertMany(products);
  console.log("Seeded 1200 products!");
  process.exit();
};

generateProducts();