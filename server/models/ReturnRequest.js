const mongoose = require("mongoose")

const returnRequestSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      enum: ["Damaged Product", "Defective Product", "Wrong Product Delivered", "Leaked Product", "Other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 1 && v.length <= 5;
        },
        message: "You must upload between 1 and 5 images.",
      },
      required: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Refunded"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("ReturnRequest", returnRequestSchema)
