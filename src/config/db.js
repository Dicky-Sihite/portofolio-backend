const mongoose = require("mongoose")

let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 10000,
    })

    isConnected = true
    console.log("MongoDB Atlas connected")

  } catch (error) {
    console.error("Database connection failed:", error.message)
    throw error
  }
}

module.exports = connectDB