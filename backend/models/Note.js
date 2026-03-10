const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },

  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    required: true
  },

  timestamp: {
    type: String
  },

  tags: [
    {
      type: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

// auto update updatedAt
noteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Note', noteSchema);