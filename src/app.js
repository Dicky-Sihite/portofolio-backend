const express = require("express")
const app = express()
const projectRoutes = require("./routes/projectRoutes")
const authRoutes = require("./routes/authRoutes")
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use("/api",projectRoutes)
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("Backend API running")
})

module.exports = app