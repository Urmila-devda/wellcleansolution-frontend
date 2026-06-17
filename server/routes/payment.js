const express = require("express")
const router = express.Router()
const Razorpay = require("razorpay")
const crypto = require("crypto")
const Order = require("../models/Order")
const Product = require("../models/Product")
const Cart = require("../models/Cart")
const { protect } = require("../middleware/auth")
const { sendOrderConfirmationEmail, sendAdminNewOrderEmail } = require("../utils/mailer")

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_placeholder",
})

// @desc    Create a new Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
router.post("/create-order", protect, async (req, res) => {
  const { amount } = req.body

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid payment amount" })
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
    }

    const order = await razorpay.orders.create(options)
    res.status(201).json(order)
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    res.status(500).json({ message: "Failed to create payment gateway order" })
  }
})

// @desc    Verify Razorpay payment signature & create verified Order
// @route   POST /api/payment/verify-payment
// @access  Private
router.post("/verify-payment", protect, async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    items,
    shippingAddress,
    couponCode,
  } = req.body

  // Validation
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ message: "Payment checkout response details are incomplete" })
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Ordered item checklist is empty" })
  }

  if (
    !shippingAddress ||
    !shippingAddress.street ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.zip ||
    !shippingAddress.country ||
    !shippingAddress.phone
  ) {
    return res.status(400).json({ message: "Please provide a complete shipping address and contact number" })
  }

  try {
    // 1. Verify Signature Authenticity
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_placeholder"
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment validation failed. Invalid signature." })
    }

    // 2. Validate Items, Stock and Compute Grand Total on Server (Security Requirement)
    let computedTotal = 0
    const processedItems = []

    for (const item of items) {
      const productId = item.productId || item.product || item.id
      if (!productId) {
        return res.status(400).json({ message: "Invalid product identifier" })
      }

      if (item.quantity <= 0) {
        return res.status(400).json({ message: `Quantity for item must be greater than 0` })
      }

      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({ message: `Product not found` })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` })
      }

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

    // Apply coupon if valid
    let finalTotal = computedTotal
    if (couponCode === "WELCOME25") {
      finalTotal = computedTotal * 0.75 // 25% off
    }

    // Add shipping rule: order value > 50 ? 0 : 5.99
    const shipping = finalTotal > 50 ? 0 : 5.99
    finalTotal += shipping
    finalTotal = Number(finalTotal.toFixed(2))

    // 3. Generate Unique Order Number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

    // 4. Create verified Paid Order in MongoDB
    const order = await Order.create({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      items: processedItems,
      totalAmount: finalTotal,
      shippingAddress: shippingAddress,
      paymentStatus: "Paid",
      orderStatus: "Processing",
      orderNumber,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    })

    // 5. Clear Customer Cart from DB
    let cart = await Cart.findOne({ user: req.user.id })
    if (cart) {
      cart.items = []
      await cart.save()
    }

    // 6. Send email confirmations asynchronously
    try {
      await sendOrderConfirmationEmail(order, req.user)
      await sendAdminNewOrderEmail(order, req.user)
    } catch (emailError) {
      console.error("Failed to send order notifications:", emailError)
    }

    res.status(201).json(order)
  } catch (error) {
    console.error("Payment verification and database save error:", error)
    res.status(500).json({ message: "Server error finalizing purchase order" })
  }
})

module.exports = router
