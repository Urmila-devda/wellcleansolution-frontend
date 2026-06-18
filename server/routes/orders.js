const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const Product = require("../models/Product")
const Cart = require("../models/Cart")
const User = require("../models/User")
const { protect, isAdmin } = require("../middleware/auth")
const { sendOrderConfirmationEmail, sendAdminNewOrderEmail } = require("../utils/mailer")

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
router.post("/", protect, async (req, res) => {
  const { items, shippingAddress } = req.body

  // Validation rules
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart cannot be empty" })
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip || !shippingAddress.country || !shippingAddress.phone) {
    return res.status(400).json({ message: "Please provide a complete shipping address and contact number" })
  }

  try {
    let computedTotal = 0
    const processedItems = []

    // Verify stock and compute price database-side (Security requirement)
    for (const item of items) {
      if (item.quantity <= 0) {
        return res.status(400).json({ message: `Quantity for item must be greater than 0` })
      }

      const product = await Product.findById(item.product._id || item.product)
      if (!product) {
        return res.status(404).json({ message: `Product not found` })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` })
      }

      // Automatically calculate total and subtotal
      const itemSubtotal = product.price * item.quantity
      computedTotal += itemSubtotal

      processedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || product.imageKey,
      })

      // Deduct stock levels
      product.stock -= item.quantity
      await product.save()
    }

    // Apply Coupon discount code if welcome is passed (optional feature from drawer: WELCOME25)
    // We can compute the discount here if the customer applied a coupon
    let finalTotal = computedTotal
    if (req.body.couponCode === "WELCOME25") {
      finalTotal = computedTotal * 0.75 // 25% off
    }
    // Add shipping: subtotal > 99 ? 0 : 5.99
    const shipping = finalTotal > 99 ? 0 : 5.99
    finalTotal += shipping

    // Create the Order
    const order = await Order.create({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      items: processedItems,
      totalAmount: Number(finalTotal.toFixed(2)),
      shippingAddress: shippingAddress,
      orderStatus: "Pending",
      paymentStatus: "Pending",
    })

    // Clear user's cart in the database
    let cart = await Cart.findOne({ user: req.user.id })
    if (cart) {
      cart.items = []
      await cart.save()
    }

    // Send email notifications sequentially and handle any failures
    try {
      await sendOrderConfirmationEmail(order, req.user)
      await sendAdminNewOrderEmail(order, req.user)
    } catch (emailError) {
      console.error("Failed to send order email alerts:", emailError)
    }

    res.status(201).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error placing order" })
  }
})

// @desc    Get order history of logged-in customer
// @route   GET /api/orders/my-orders
// @access  Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error fetching order history" })
  }
})

// @desc    Get a single order by ID
// @route   GET /api/orders/:orderId
// @access  Private
router.get("/:orderId", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Security check: verify that req.user.id matches order.userId or req.user is admin
    if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" })
    }

    res.json(order)
  } catch (error) {
    console.error(error)
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Order not found" })
    }
    res.status(500).json({ message: "Server error fetching order details" })
  }
})

// @desc    Get all orders & metrics summary
// @route   GET /api/orders
// @access  Private/Admin
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("userId", "name email").sort({ createdAt: -1 })
    
    // Compute quick dashboard analytics
    const totalOrdersCount = orders.length
    const pendingOrdersCount = orders.filter(o => o.orderStatus === "Pending").length
    const totalUsersCount = await User.countDocuments({ role: "customer" })
    
    const revenueSummary = orders.reduce((sum, order) => {
      // Only count non-cancelled orders for revenue
      if (order.orderStatus === "Cancelled") return sum
      return sum + order.totalAmount
    }, 0)

    res.json({
      orders,
      stats: {
        totalOrders: totalOrdersCount,
        pendingOrders: pendingOrdersCount,
        totalUsers: totalUsersCount,
        totalRevenue: Number(revenueSummary.toFixed(2)),
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error fetching admin orders" })
  }
})

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, isAdmin, async (req, res) => {
  const { status } = req.body

  const validStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" })
  }

  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.orderStatus = status
      const updatedOrder = await order.save()

      // Emit socket event to the user's room
      const io = req.app.get("io")
      if (io) {
        io.to(updatedOrder.userId.toString()).emit("order_status_updated", {
          orderId: updatedOrder._id,
          orderStatus: updatedOrder.orderStatus,
          updatedAt: updatedOrder.updatedAt,
        })
      }

      res.json(updatedOrder)
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error updating order status" })
  }
})

module.exports = router
