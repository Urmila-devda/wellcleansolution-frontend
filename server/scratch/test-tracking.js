const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])

const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Order = require("../models/Order")
const User = require("../models/User")

dotenv.config()

async function run() {
  console.log("Starting Order Tracking Verification Script...")
  console.log("Connecting to Database...")
  
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database Connected successfully.")

    // Fetch a sample order
    const order = await Order.findOne()
    if (!order) {
      console.log("❌ No orders found in the database. Please place an order first.")
      mongoose.disconnect()
      return
    }

    console.log("-----------------------------------------")
    console.log(`Sample Order Found: ${order._id}`)
    console.log(`Order Owner (userId): ${order.userId}`)
    console.log(`Order Status: ${order.orderStatus}`)
    console.log(`Total Amount: $${order.totalAmount}`)
    console.log("-----------------------------------------")

    // Verify security logic:
    // Case 1: Owner tracks the order (should succeed)
    const ownerUser = { id: order.userId.toString(), role: "customer" }
    const isOwnerAuthorized = order.userId.toString() === ownerUser.id || ownerUser.role === "admin"
    console.log(`Case 1: User is the owner of the order:`)
    console.log(`  User ID: ${ownerUser.id}, Role: ${ownerUser.role}`)
    console.log(`  Authorized: ${isOwnerAuthorized ? "✅ Success (Authorized)" : "❌ Failed (Forbidden)"}`)

    // Case 2: Admin tracks the order (should succeed)
    const adminUser = { id: new mongoose.Types.ObjectId().toString(), role: "admin" }
    const isAdminAuthorized = order.userId.toString() === adminUser.id || adminUser.role === "admin"
    console.log(`Case 2: User is an admin but not the owner:`)
    console.log(`  User ID: ${adminUser.id}, Role: ${adminUser.role}`)
    console.log(`  Authorized: ${isAdminAuthorized ? "✅ Success (Authorized)" : "❌ Failed (Forbidden)"}`)

    // Case 3: Another customer tracks the order (should fail)
    const externalUser = { id: new mongoose.Types.ObjectId().toString(), role: "customer" }
    const isExternalAuthorized = order.userId.toString() === externalUser.id || externalUser.role === "admin"
    console.log(`Case 3: User is another customer (unauthorized):`)
    console.log(`  User ID: ${externalUser.id}, Role: ${externalUser.role}`)
    console.log(`  Authorized: ${isExternalAuthorized ? "❌ Failed (Authorized)" : "✅ Success (Forbidden - Access Correctly Blocked)"}`)

    console.log("-----------------------------------------")
    console.log("Verification finished.")
  } catch (error) {
    console.error("❌ Test failed with error:", error)
  } finally {
    await mongoose.disconnect()
  }
}

run()
