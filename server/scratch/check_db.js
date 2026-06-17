const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("../models/Product");

async function debugImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({});
    console.log(`Found ${products.length} products:`);
    
    for (const p of products) {
      console.log(`- Product: "${p.name}", Images: ${JSON.stringify(p.images)}`);
    }
    
    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
  }
}

debugImages();
