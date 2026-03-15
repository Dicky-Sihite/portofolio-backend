const express = require("express")
const router = express.Router()
const upload = require("../middleware/uploadMiddleware")
const protect = require("../middleware/authMiddleware")

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require("../controllers/projectController")

router.get("/projects", getProjects)

router.get("/projects/:id", getProjectById)

router.post("/projects", protect, upload.single("image"), createProject)

router.put("/projects/:id", protect, updateProject)

router.delete("/projects/:id", protect, deleteProject)

module.exports = router