const cloudinary = require("cloudinary").v2
const fs = require("fs")
const path = require("path")

// Helper to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    if (!url || !url.includes("/upload/")) return null
    const parts = url.split("/upload/")
    if (parts.length < 2) return null
    const pathAndFilename = parts[1].replace(/^v\d+\//, "") // remove version number if present (e.g. v1612345678/)
    const lastDotIndex = pathAndFilename.lastIndexOf(".")
    if (lastDotIndex === -1) return pathAndFilename
    return pathAndFilename.substring(0, lastDotIndex)
  } catch (error) {
    console.error("Error parsing Cloudinary URL:", error)
    return null
  }
}

// Upload a local temp file to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    // Check if Cloudinary is configured
    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET

    if (!isCloudinaryConfigured) {
      console.log("Cloudinary is not configured. Falling back to local storage URL.")
      // Return relative static path
      return `/uploads/${path.basename(filePath)}`
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    // Upload file
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "wellclean_products"
    })

    // Remove local temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    return result.secure_url
  } catch (error) {
    console.error("Cloudinary upload failed:", error)
    // Fall back to local URL if upload fails so the app continues working
    return `/uploads/${path.basename(filePath)}`
  }
}

// Delete an image from Cloudinary or local uploads folder
const deleteImageFromStorage = async (url) => {
  if (!url) return

  try {
    if (url.includes("cloudinary.com")) {
      const publicId = getPublicIdFromUrl(url)
      if (publicId) {
        // Configure Cloudinary
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
        })
        await cloudinary.uploader.destroy(publicId)
        console.log(`Successfully deleted from Cloudinary: ${publicId}`)
      }
    } else if (url.includes("/uploads/")) {
      // Delete local file
      const filename = url.split("/uploads/")[1]
      const localPath = path.join(__dirname, "..", "uploads", filename)
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath)
        console.log(`Successfully deleted local file: ${localPath}`)
      }
    }
  } catch (error) {
    console.error(`Error deleting image from storage: ${url}`, error)
  }
}

module.exports = {
  uploadToCloudinary,
  deleteImageFromStorage
}
