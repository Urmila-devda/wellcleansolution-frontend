const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])

const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const connectDB = require("./config/db")

dotenv.config()

connectDB()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

// Attach io to the app instance
app.set("io", io)

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`)

  socket.on("join_room", (userId) => {
    socket.join(userId)
    console.log(`Socket ${socket.id} joined room: ${userId}`)
  })

  socket.on("update_order_status", ({ orderId, userId, status }) => {
    io.to(userId).emit("order_status_updated", {
      orderId,
      orderStatus: status,
      updatedAt: new Date()
    })
    console.log(`Socket broadcasted status update for order ${orderId} to user room ${userId}`)
  })

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`)
  })
})

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Mount API Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/products", require("./routes/products"))
app.use("/api/cart", require("./routes/cart"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/payment", require("./routes/payment"))
app.use("/api/enquiries", require("./routes/enquiries"))

app.get("/", (req, res) => {
  res.send("API Running")
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})