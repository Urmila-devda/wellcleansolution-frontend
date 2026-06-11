const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    const email = "wellcleansolutions11@gmail.com";
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`No user found with email: ${email}`);
    } else {
      console.log("User found:", {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        passwordHash: user.password
      });
      const matches = await user.matchPassword("adminpassword");
      console.log(`Does password 'adminpassword' match?`, matches);
    }
    mongoose.connection.close();
  } catch (error) {
    console.error("Error testing login:", error);
  }
};

testLogin();
