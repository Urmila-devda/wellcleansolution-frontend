const express = require("express")
const router = express.Router()
const Enquiry = require("../models/Enquiry")
const { protect, isAdmin } = require("../middleware/auth")
const { sendCustomerEnquiryAckEmail, sendAdminEnquiryAlertEmail } = require("../utils/mailer")

// @desc    Submit a new customer/business enquiry
// @route   POST /api/enquiries
// @access  Public
router.post("/", async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body

  // 1. Validation for empty fields
  if (!fullName || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: "All fields are required. Please fill in the entire form." })
  }

  // 2. Email format validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." })
  }

  // 3. Phone format validation
  // Allows optional leading + and digits, spaces, hyphens, parentheses
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-s./0-9]{6,15}$/
  if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
    return res.status(400).json({ message: "Please provide a valid phone number (minimum 6 digits)." })
  }

  try {
    const enquiry = new Enquiry({
      fullName,
      email,
      phone,
      subject,
      message,
    })

    const savedEnquiry = await enquiry.save()

    // Dispatch emails asynchronously
    sendCustomerEnquiryAckEmail(savedEnquiry).catch(err => console.error("Error in customer ack email background task:", err))
    sendAdminEnquiryAlertEmail(savedEnquiry).catch(err => console.error("Error in admin alert email background task:", err))

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully! Our team will contact you shortly.",
      enquiry: savedEnquiry,
    })
  } catch (error) {
    console.error("Error saving enquiry:", error)
    res.status(500).json({ message: "Server error saving enquiry. Please try again." })
  }
})

// @desc    Get all enquiries with optional search query & status filter
// @route   GET /api/enquiries
// @access  Private/Admin
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const { search, status } = req.query
    let query = {}

    // Status filter
    if (status && status !== "All") {
      query.status = status
    }

    // Search query filter (matches fullName, email, subject, message)
    if (search) {
      const searchRegex = new RegExp(search, "i")
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ]
    }

    // Sort by newest first
    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 })
    res.json(enquiries)
  } catch (error) {
    console.error("Error retrieving enquiries:", error)
    res.status(500).json({ message: "Server error fetching enquiries list." })
  }
})

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, isAdmin, async (req, res) => {
  const { status } = req.body

  if (!status || !["New", "In Progress", "Resolved"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value. Must be New, In Progress, or Resolved." })
  }

  try {
    const enquiry = await Enquiry.findById(req.params.id)

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found." })
    }

    enquiry.status = status
    const updatedEnquiry = await enquiry.save()

    res.json(updatedEnquiry)
  } catch (error) {
    console.error("Error updating enquiry status:", error)
    res.status(500).json({ message: "Server error updating enquiry status." })
  }
})

module.exports = router
