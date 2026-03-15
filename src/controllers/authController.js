const User = require("../models/authRoutes")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.login = async (req, res) => {

  const { username, password } = req.body

  const user = await User.findOne({ username })

  if (!user) {
    return res.status(401).json({ message: "User not found" })
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return res.status(401).json({ message: "Invalid password" })
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  res.json({ token })
}
