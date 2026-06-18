const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])

const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")
const Product = require("../models/Product")
const User = require("../models/User")
const Order = require("../models/Order")

dotenv.config({ path: path.join(__dirname, "..", ".env") })

const products = [
  {
    name: "Well Clean Solutions Hand Wash",
    category: "Hand Wash",
    description: "Gentle on hands, tough on germs. Formulated with skin-softening aloe vera and tea tree oil.",
    details: "Our hand wash cleanses thoroughly while keeping your skin hydrated. Fortified with organic aloe leaf extracts and natural antibacterial tea tree oil, it forms a protective defense barrier on your hands without stripping moisture.",
    price: 8.99,
    rating: 4.8,
    images: ["/uploads/handwash.png"],
    imageKey: "handwash",
    tag: "Best Seller",
    stock: 50,
    specs: [
      { name: "Bottle Volume", value: "500 ml" },
      { name: "Safety Rating", value: "99.9% Biodegradable" },
      { name: "Fragrance", value: "Lavender Mint" }
    ],
    ingredients: "Aqua (water), Coco-Glucoside, Aloe Barbadensis leaf juice, Melaleuca Alternifolia (tea tree) oil, Lavender oil, Citric acid."
  },
  {
    name: "Well Clean Solutions Toilet Cleaner",
    category: "Toilet Cleaner",
    description: "Powerful sanitation that clings to surfaces to remove rust, lime scale, and bathroom germs.",
    details: "This heavy-duty gel formula clings to toilet bowls to dissolve mineral rings, lime scale, and tough stains. Lab-tested to eradicate 99.9% of bacteria, leaving a refreshing pine scent without any toxic bleach fumes.",
    price: 10.49,
    rating: 4.9,
    images: ["/uploads/toilet_cleaner.png"],
    imageKey: "toilet",
    tag: "Extra Fresh",
    stock: 50,
    specs: [
      { name: "Bottle Volume", value: "750 ml" },
      { name: "Safety Rating", value: "Safe for septic systems" },
      { name: "Fragrance", value: "Pine Breeze" }
    ],
    ingredients: "Purified Water, Citric acid, Xanthan gum, Alkyl polyglucoside, Natural essential pine oil."
  },
  {
    name: "Well Clean Solutions Glass Cleaner",
    category: "Glass Cleaner",
    description: "Streak-free shine on all glass surfaces. Quickly cuts through grease, fingerprints, and dust.",
    details: "Make windows, glass tabletops, and mirrors virtually invisible. Our ammonia-free cleaner evaporates quickly, cutting through grease films, fingerprints, smudge marks, and dust particles with no streaks or residue.",
    price: 7.99,
    rating: 4.7,
    images: ["/uploads/glass_cleaner.png"],
    imageKey: "glass",
    tag: "Streak Free",
    stock: 50,
    specs: [
      { name: "Bottle Volume", value: "500 ml" },
      { name: "Safety Rating", value: "Ammonia-free formulation" },
      { name: "Fragrance", value: "Fresh Citrus" }
    ],
    ingredients: "Purified Water, Bio-Ethanol (derived from corn), Decyl glucoside, Lemon essential oil."
  },
  {
    name: "Well Clean Solutions Floor Cleaner",
    category: "Floor Cleaner",
    description: "Deep-cleaning floor concentrate that restores shine to tiles, wood, and marble. No rinsing required.",
    details: "Revitalize dull floors with our botanical concentrate. Suitable for hardwood, tile, marble, and laminate. Dilutes easily in water, lifting heavy grime and soil while restoring a clean streak-free natural sheen.",
    price: 12.99,
    rating: 4.8,
    images: ["/uploads/floor_cleaner.png"],
    imageKey: "floor",
    tag: "Concentrate",
    stock: 50,
    specs: [
      { name: "Bottle Volume", value: "1000 ml" },
      { name: "Safety Rating", value: "Concentrated formula" },
      { name: "Fragrance", value: "Ocean Lavender" }
    ],
    ingredients: "Purified Water, Sodium methyl cocoyl taurate, Coconut fatty acid, Organic lavender essential oil."
  },
  {
    name: "Well Clean Solutions Dish Wash Liquid",
    category: "Dish Wash Liquid",
    description: "High-foaming dish liquid that cuts through heavy grease easily, leaving plates sparkling clean.",
    details: "Tough on stubborn food residue and heavy baking grease, but gentle on your hands. Features a high-foaming suds system derived from coconut, combined with organic lemon peel extracts that deodorize effectively.",
    price: 6.99,
    rating: 4.9,
    images: ["/uploads/dishwash.png"],
    imageKey: "dishwash",
    tag: "Tough on Grease",
    stock: 50,
    specs: [
      { name: "Bottle Volume", value: "650 ml" },
      { name: "Safety Rating", value: "Phosphate & SLS free" },
      { name: "Fragrance", value: "Zesty Lemon" }
    ],
    ingredients: "Purified Water, Coco betaine, Lemon peel oil extract, Citric acid, Glycerin (vegetable derived)."
  },
  {
    name: "Well Clean Solutions Multi-Surface Cleaner",
    category: "Surface Cleaner",
    description: "All-purpose spray that sanitizes kitchen counters, tables, wood, and steel. Non-toxic and rinse-free.",
    details: "One spray to clean them all. Perfect for kitchen countertops, wooden dining tables, cabinet doors, and stainless steel appliances. Formulated with eucalyptus and peppermint essential oils to disinfect without chemicals.",
    price: 9.49,
    rating: 4.8,
    images: ["/uploads/multi_surface.png"],
    imageKey: "surface",
    tag: "Multi-Purpose",
    stock: 50,
    specs: [
      { name: "Bottle Volume", value: "500 ml" },
      { name: "Safety Rating", value: "Zero harsh fumes, 100% natural" },
      { name: "Fragrance", value: "Eucalyptus Mint" }
    ],
    ingredients: "Purified Water, Caprylyl/Capryl glucoside, Organic eucalyptus oil, Peppermint essential oil."
  }
]

const copyAssetsToUploads = () => {
  const sourceDir = path.join(__dirname, "..", "..", "client", "src", "assets")
  const destDir = path.join(__dirname, "..", "uploads")

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const filesToCopy = [
    { src: "handwash.png", dest: "handwash.png" },
    { src: "toilet_cleaner.png", dest: "toilet_cleaner.png" },
    { src: "glass_cleaner.png", dest: "glass_cleaner.png" },
    { src: "floor_cleaner.png", dest: "floor_cleaner.png" },
    { src: "dishwash.png", dest: "dishwash.png" },
    { src: "multi_surface.png", dest: "multi_surface.png" },
  ]

  console.log("Copying assets to server uploads folder...")
  for (const file of filesToCopy) {
    const srcPath = path.join(sourceDir, file.src)
    const destPath = path.join(destDir, file.dest)
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath)
      console.log(`Copied ${file.src} to server/uploads`)
    } else {
      console.warn(`Source asset not found: ${srcPath}`)
    }
  }
}

const seedDatabase = async () => {
  try {
    copyAssetsToUploads()

    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB for seeding...")

    // Clear existing products and orders
    await Product.deleteMany({})
    await Order.deleteMany({})
    console.log("Cleared existing products and orders from database.")

    // Insert seeded products
    await Product.insertMany(products)
    console.log("Seeded database with default products successfully!")

    const seededProducts = await Product.find({})
    const customer = await User.findOne({ role: "customer" }) || await User.create({
      name: "Test User",
      email: "test@user.com",
      password: "testpassword",
      phone: "555-555-5555",
      role: "customer"
    })

    const orderDates = [
      new Date(),
      new Date(Date.now() - 24 * 60 * 60 * 1000),
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    ]

    const orderStatuses = ["Delivered", "Processing", "Pending"]
    const orderAmounts = [26.47, 18.98, 30.97]

    for (let i = 0; i < 3; i++) {
      await Order.create({
        userId: customer._id,
        userName: customer.name,
        userEmail: customer.email,
        items: [
          {
            productId: seededProducts[i % seededProducts.length]._id,
            name: seededProducts[i % seededProducts.length].name,
            price: seededProducts[i % seededProducts.length].price,
            quantity: 2,
            image: seededProducts[i % seededProducts.length].images[0] || seededProducts[i % seededProducts.length].imageKey
          }
        ],
        totalAmount: orderAmounts[i],
        shippingAddress: {
          street: "123 Green Ave",
          city: "West Town",
          state: "CA",
          zip: "90210",
          country: "USA",
          phone: "555-555-5555"
        },
        orderStatus: orderStatuses[i],
        paymentStatus: "Paid",
        createdAt: orderDates[i]
      })
    }
    console.log("Seeded default order records matching new schema successfully!")

    // Let's also verify/create a seed admin user if not exists for easy testing
    const adminEmail = "wellclean11@gmail.com"

    // Clean up old default admin if it exists or ensure only the current one exists
    await User.deleteMany({ role: "admin", email: { $ne: adminEmail } })

    const adminExists = await User.findOne({ email: adminEmail })
    if (!adminExists) {
      const bcrypt = require("bcryptjs")
      // Create admin user: password will be hashed by User save hooks
      await User.create({
        name: "WellClean Admin",
        email: adminEmail,
        password: "adminpassword",
        phone: "7021204733",
        role: "admin",
      })
      console.log(`Created default Admin user: ${adminEmail} / adminpassword`)
    } else {
      console.log(`Admin user already exists: ${adminEmail}`)
    }

    mongoose.connection.close()
    console.log("Database connection closed. Seeding complete.")
  } catch (error) {
    console.error("Seeding error:", error)
    process.exit(1)
  }
}

seedDatabase()
