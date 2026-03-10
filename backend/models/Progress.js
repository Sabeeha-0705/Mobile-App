const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },

  completedVideos: [
    {
      videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
      },
      completedAt: Date,
      watchTime: Number
    }
  ],

  quizScore: {
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    attemptedAt: Date
  },

  completionPercentage: {
    type: Number,
    default: 0
  },

  isCompleted: {
    type: Boolean,
    default: false
  },

  completedAt: Date,

  lastAccessedAt: {
    type: Date,
    default: Date.now
  },

  timeSpent: {
    type: Number,
    default: 0
  }

});

progressSchema.index(
  { userId: 1, courseId: 1 },
  { unique: true }
);

module.exports = mongoose.model('Progress', progressSchema);