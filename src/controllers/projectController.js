const Project = require("../models/projectModel")
const slugify = require("slugify")

// GET all projects
exports.getProjects = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ""

    const query = {
      title: { $regex: search, $options: "i" }
    }

    const total = await Project.countDocuments(query).maxTimeMS(5000)

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .maxTimeMS(5000)

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: projects
    })

  } catch (error) {
    console.error("Error fetching projects:", error)
    res.status(500).json({ 
      message: error.message || "Failed to fetch projects",
      error: process.env.NODE_ENV === "development" ? error : undefined
    })

  }
}


// GET single project
exports.getProjectById = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }
}


// CREATE project with image upload
exports.createProject = async (req, res) => {
  try {

    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ message: "Title and description required" })
    }

    const technologies = req.body.technologies
      ? JSON.parse(req.body.technologies)
      : []

    // Generate unique slug
    let baseSlug = slugify(req.body.title, { lower: true })
    let slug = baseSlug
    let counter = 1
    while (await Project.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const project = new Project({
      ...req.body,
      technologies: technologies,
      slug: slug,
      imageUrl: req.file ? req.file.path : null
    })

    const savedProject = await project.save()

    res.status(201).json(savedProject)

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A project with this slug already exists. Please choose a different title." })
    }
    res.status(400).json({ message: error.message })
  }
}


// UPDATE project
exports.updateProject = async (req, res) => {
  try {

    if (req.body.title) {
      let baseSlug = slugify(req.body.title, { lower: true })
      let slug = baseSlug
      let counter = 1
      
      // Ensure the conflicting slug is not the current project's own slug
      let existingProject = await Project.findOne({ slug, _id: { $ne: req.params.id } })
      while (existingProject) {
        slug = `${baseSlug}-${counter}`
        counter++
        existingProject = await Project.findOne({ slug, _id: { $ne: req.params.id } })
      }
      
      req.body.slug = slug
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(project)

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A project with this slug already exists. Please choose a different title." })
    }
    res.status(400).json({ message: error.message })
  }
}


// DELETE project
exports.deleteProject = async (req, res) => {
  try {

    await Project.findByIdAndDelete(req.params.id)

    res.json({ message: "Project deleted" })

  } catch (error) {

    res.status(500).json({ message: error.message })

  }
}
