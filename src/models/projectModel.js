const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    unique: false
  },

  description: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String
  },

  technologies: [{
    type: String
  }],

  githubLink: {
    type: String
  },

  demoLink: {
    type: String
  },

  featured: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Project", projectSchema)