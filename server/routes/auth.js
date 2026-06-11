const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { protect } = require("../middleware/auth")

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "wellclean_secret_key_12345", {
    expiresIn: "30d",
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword, phone } = req.body

  // Validation rules
  if (!name || !email || !password || !confirmPassword || !phone) {
    return res.status(400).json({ message: "All fields are required" })
  }

  // Email format validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" })
  }

  // Strong password rule (at least 6 characters)
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" })
  }

  // Confirm password match check
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" })
  }

  try {
    // Check if email is unique
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Register User (Role defaults to customer)
    const user = await User.create({
      name,
      email,
      password,
      phone,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  // Required validations
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password" })
  }

  try {
    // Find User by email
    const user = await User.findOne({ email })

    // Match credentials
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
