const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Product = require("../models/Product")
const User = require("../models/User")
const { protect, isAdmin } = require("../middleware/auth")
const upload = require("../middleware/upload")
const { uploadToCloudinary, deleteImageFromStorage } = require("../utils/cloudinary")

// Helper to check if requester is an admin
const isRequesterAdmin = async (req) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "wellclean_secret_key_12345")
      const user = await User.findById(decoded.id)
      return user && user.role === "admin"
    }
  } catch (error) {
    // Treat as non-admin if verification fails
  }
  return false
}

// @desc    Get all products (with optional search and category filters)
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query
    let query = {}

    // Category filter
    if (category && category !== "All") {
      query.category = category
    }

    // Keyword search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ]
    }

    const adminRequest = await isRequesterAdmin(req)
    let queryBuilder = Product.find(query)
    if (adminRequest) {
      queryBuilder = queryBuilder.select("+hsnCode +gst")
    }
    const products = await queryBuilder
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error fetching products" })
  }
})

// @desc    Upload product images (max 5)
// @route   POST /api/products/upload
// @access  Private/Admin
router.post("/upload", protect, isAdmin, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" })
    }
    const urls = []
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.path)
      urls.push(url)
    }
    res.json({ urls })
  } catch (error) {
    console.error("Upload endpoint error:", error)
    res.status(500).json({ message: error.message || "Failed to upload images" })
  }
})

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const adminRequest = await isRequesterAdmin(req)
    let queryBuilder = Product.findById(req.params.id)
    if (adminRequest) {
      queryBuilder = queryBuilder.select("+hsnCode +gst")
    }
    const product = await queryBuilder
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error fetching product details" })
  }
})

const inferCategory = (name) => {
  if (!name) return "Surface Cleaner"
  const n = name.toLowerCase()
  if (n.includes("hand") || n.includes("wash")) return "Hand Wash"
  if (n.includes("toilet")) return "Toilet Cleaner"
  if (n.includes("glass")) return "Glass Cleaner"
  if (n.includes("floor")) return "Floor Cleaner"
  if (n.includes("dish")) return "Dish Wash Liquid"
  return "Surface Cleaner"
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", protect, isAdmin, async (req, res) => {
  const { name, description, details, price, images, tag, stock, specs, ingredients, size, hsnCode, gst } = req.body

  if (!name || !description || !details || price === undefined || stock === undefined) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  if (!images || !Array.isArray(images) || images.length < 1 || images.length > 5) {
    return res.status(400).json({ message: "Product must have between 1 and 5 images" })
  }

  try {
    const category = inferCategory(name)
    const product = new Product({
      name,
      category,
      description,
      details,
      price,
      images,
      imageKey: images[0], // legacy mapping fallback
      tag,
      stock,
      specs: specs || [],
      ingredients,
      size: size || "1 Litre",
      hsnCode,
      gst,
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error creating product" })
  }
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put("/:id", protect, isAdmin, async (req, res) => {
  const { name, description, details, price, images, tag, stock, specs, ingredients, size, hsnCode, gst } = req.body

  try {
    const product = await Product.findById(req.params.id).select("+hsnCode +gst")

    if (product) {
      // Process image updates and clean up deleted files
      if (images && Array.isArray(images)) {
        if (images.length < 1 || images.length > 5) {
          return res.status(400).json({ message: "Product must have between 1 and 5 images" })
        }
        
        const oldImages = product.images || []
        const deletedImages = oldImages.filter(img => !images.includes(img))
        
        for (const imgUrl of deletedImages) {
          await deleteImageFromStorage(imgUrl)
        }
        
        product.images = images
        product.imageKey = images[0] // sync legacy fallback
      }

      product.name = name !== undefined ? name : product.name
      if (name !== undefined) {
        product.category = inferCategory(name)
      }
      product.description = description !== undefined ? description : product.description
      product.details = details !== undefined ? details : product.details
      product.price = price !== undefined ? price : product.price
      product.tag = tag !== undefined ? tag : product.tag
      product.stock = stock !== undefined ? stock : product.stock
      product.specs = specs !== undefined ? specs : product.specs
      product.ingredients = ingredients !== undefined ? ingredients : product.ingredients
      product.size = size !== undefined ? size : product.size
      product.hsnCode = hsnCode !== undefined ? hsnCode : product.hsnCode
      product.gst = gst !== undefined ? gst : product.gst

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error updating product" })
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      // Delete all images associated with this product
      const imageUrls = product.images || []
      for (const imgUrl of imageUrls) {
        await deleteImageFromStorage(imgUrl)
      }

      await Product.deleteOne({ _id: req.params.id })
      res.json({ message: "Product removed successfully" })
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error deleting product" })
  }
})

module.exports = router
