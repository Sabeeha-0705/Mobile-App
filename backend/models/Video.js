const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: String,

  videoUrl: {
    type: String,
    required: true
  },

  youtubeUrl: String,

  thumbnail: String,

  duration: String,

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },

  order: {
    type: Number,
    default: 0
  },

  isPreview: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Video', videoSchema);