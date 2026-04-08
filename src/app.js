const express = require("express")
const app = express()
const projectRoutes = require("./routes/projectRoutes")
const authRoutes = require("./routes/authRoutes")
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use("/api", projectRoutes)
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("Backend API running")
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  })
})

module.exports = app