require("dotenv").config()

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const User = require("./src/models/authRoutes")

async function createAdmin() {

  try {

    await mongoose.connect(process.env.MONGO_URI)

    const hashedPassword = await bcrypt.hash("admin123", 10)

    const admin = new User({
      username: "admin",
      password: hashedPassword
    })

    await admin.save()

    console.log("Admin created successfully")

    process.exit()

  } catch (error) {

    console.error(error)
    process.exit(1)

  }

}

createAdmin()