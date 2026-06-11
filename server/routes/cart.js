const express = require("express")
const router = express.Router()
const Cart = require("../models/Cart")
const { protect } = require("../middleware/auth")

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product")

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = await Cart.create({ user: req.user.id, items: [] })
    }

    res.json(cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error fetching cart" })
  }
})

// @desc    Sync user's cart items
// @route   POST /api/cart
// @access  Private
router.post("/", protect, async (req, res) => {
  const { items } = req.body

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid items format" })
  }

  try {
    let cart = await Cart.findOne({ user: req.user.id })

    // Map items to schema format (filtering out items with quantity <= 0)
    const formattedItems = items
      .filter(item => item.product && item.quantity > 0)
      .map(item => ({
        product: item.product._id || item.product,
        quantity: item.quantity,
      }))

    if (cart) {
      cart.items = formattedItems
      await cart.save()
    } else {
      cart = await Cart.create({
        user: req.user.id,
        items: formattedItems,
      })
    }

    // Populate and send back updated cart
    await cart.populate("items.product")
    res.json(cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error saving cart" })
  }
})

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
router.delete("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
    if (cart) {
      cart.items = []
      await cart.save()
    }
    res.json({ message: "Cart cleared" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error clearing cart" })
  }
})

module.exports = router
