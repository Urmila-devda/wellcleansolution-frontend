const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const ReturnRequest = require("../models/ReturnRequest")
const Order = require("../models/Order")
const { protect, isAdmin } = require("../middleware/auth")
const upload = require("../middleware/upload")
const { uploadToCloudinary } = require("../utils/cloudinary")

// @desc    Submit a return/refund request
// @route   POST /api/return-requests
// @access  Private
router.post("/", protect, upload.array("images", 5), async (req, res) => {
  const { orderNumber, customerName, phoneNumber, email, reason, description } = req.body

  // Check required text fields
  if (!orderNumber || !customerName || !phoneNumber || !email || !reason || !description) {
    return res.status(400).json({ message: "Please provide all required fields" })
  }

  // Validate uploaded files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least 1 product image is required" })
  }
  if (req.files.length > 5) {
    return res.status(400).json({ message: "You can upload up to 5 images" })
  }

  try {
    // Look up order by orderNumber or fallback to _id
    let query = { orderNumber: orderNumber }
    if (mongoose.Types.ObjectId.isValid(orderNumber)) {
      query = { $or: [{ orderNumber: orderNumber }, { _id: orderNumber }] }
    }

    const order = await Order.findOne(query)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Security check: Order must belong to the logged-in user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to file a return request for this order" })
    }

    // Status check: Order must be delivered
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({ message: "Return requests are only accepted after the product has been delivered" })
    }

    // Check if return request already exists
    const existingRequest = await ReturnRequest.findOne({ orderId: order._id })
    if (existingRequest) {
      return res.status(400).json({ message: "A return request has already been submitted for this order" })
    }

    // Check 24-hour time constraint
    const timeDiff = Date.now() - new Date(order.updatedAt).getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    if (hoursDiff > 24) {
      return res.status(400).json({ message: "Return requests must be submitted within 24 hours of delivery" })
    }

    // Upload files to Cloudinary/local fallback
    const imageUrls = []
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.path)
      imageUrls.push(url)
    }

    // Create the ReturnRequest
    const returnRequest = new ReturnRequest({
      orderId: order._id,
      userId: req.user.id,
      orderNumber: order.orderNumber || order._id.toString(),
      customerName,
      phoneNumber,
      email,
      reason,
      description,
      images: imageUrls,
      status: "Pending",
    })

    const savedRequest = await returnRequest.save()
    res.status(201).json(savedRequest)
  } catch (error) {
    console.error("Error creating return request:", error)
    res.status(500).json({ message: "Server error processing return request" })
  }
})

// @desc    Get logged-in user's return requests
// @route   GET /api/return-requests/my-requests
// @access  Private
router.get("/my-requests", protect, async (req, res) => {
  try {
    const requests = await ReturnRequest.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    console.error("Error fetching user return requests:", error)
    res.status(500).json({ message: "Server error fetching your return requests" })
  }
})

// @desc    Get all return requests (Admin only)
// @route   GET /api/return-requests
// @access  Private/Admin
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const requests = await ReturnRequest.find()
      .populate("orderId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    console.error("Error fetching all return requests:", error)
    res.status(500).json({ message: "Server error fetching return requests" })
  }
})

// @desc    Update return request status (Admin only)
// @route   PUT /api/return-requests/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, isAdmin, async (req, res) => {
  const { status, rejectionReason } = req.body

  const validStatuses = ["Pending", "Approved", "Rejected", "Refunded"]
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" })
  }

  if (status === "Rejected" && (!rejectionReason || !rejectionReason.trim())) {
    return res.status(400).json({ message: "A rejection reason is required when rejecting a request" })
  }

  try {
    const request = await ReturnRequest.findById(req.params.id)
    if (!request) {
      return res.status(404).json({ message: "Return request not found" })
    }

    request.status = status
    if (status === "Rejected") {
      request.rejectionReason = rejectionReason
    } else {
      // Clear rejection reason if approved or refunded
      request.rejectionReason = undefined
    }

    const updatedRequest = await request.save()

    // Emit Socket.io update to the customer
    const io = req.app.get("io")
    if (io) {
      io.to(updatedRequest.userId.toString()).emit("return_request_status_updated", {
        requestId: updatedRequest._id,
        orderNumber: updatedRequest.orderNumber,
        status: updatedRequest.status,
        rejectionReason: updatedRequest.rejectionReason || "",
        updatedAt: updatedRequest.updatedAt,
      })
    }

    res.json(updatedRequest)
  } catch (error) {
    console.error("Error updating return request status:", error)
    res.status(500).json({ message: "Server error updating request status" })
  }
})

module.exports = router
