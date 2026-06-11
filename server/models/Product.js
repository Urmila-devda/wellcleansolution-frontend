const mongoose = require("mongoose")

const specSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false })

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      alias: "shortDescription",
    },
    details: {
      type: String,
      required: [true, "Detailed description is required"],
      alias: "detailedDescription",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    imageKey: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return v && v.length >= 1 && v.length <= 5
        },
        message: "A product must have between 1 and 5 images"
      }
    },
    tag: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock level is required"],
      min: [0, "Stock cannot be negative"],
      default: 50,
    },
    specs: [specSchema],
    ingredients: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Product", productSchema)
