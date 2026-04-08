require("dotenv").config()
const connectDB = require("../src/config/db")
const app = require("../src/app")

// Connect DB once
let isDbConnected = false
let dbConnectPromise = null

const ensureDbConnected = async () => {
  if (isDbConnected) return
  if (dbConnectPromise) return dbConnectPromise
  
  dbConnectPromise = connectDB()
    .then(() => {
      isDbConnected = true
    })
    .catch(error => {
      console.error("DB connection error:", error)
      dbConnectPromise = null
    })
  
  return dbConnectPromise
}

module.exports = async (req, res) => {
  try {
    await ensureDbConnected()
  } catch (error) {
    console.error("Failed to connect DB:", error)
  }

  // Call Express app handler
  return app(req, res)
}
