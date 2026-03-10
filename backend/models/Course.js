const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

  title: { type: String, required: true, trim: true },

  description: { type: String, required: true },

  category: { type: String, required: true },

  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },

  thumbnail: String,

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  instructorName: String,

  isPaid: { type: Boolean, default: false },

  price: { type: Number, default: 0 },

  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],

  resources: [{
    title: String,
    type: String,
    url: String
  }],

  quiz: {

    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
      }
    ],

    passingScore: {
      type: Number,
      default: 70
    }

  },

  duration: String,

  enrolledCount: {
    type: Number,
    default: 0
  },

  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  isPublished: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);