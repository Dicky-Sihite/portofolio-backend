require("dotenv").config()

const express = require("express")
const connectDB = require("../src/config/db")
const projectRoutes = require("../src/routes/projectRoutes")
const authRoutes = require("../src/routes/authRoutes")
const cors = require("cors")

const app = express()

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
      throw error
    })
  
  return dbConnectPromise
}

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api", projectRoutes)
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Backend API running" })
})

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({ message: "Internal server error" })
})

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    await ensureDbConnected()
  } catch (error) {
    console.error("Failed to connect DB:", error)
  }

  return app(req, res)
}
