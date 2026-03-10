//backend/models/Certificate.js

const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({

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

  certificateId: {
    type: String,
    unique: true
  },

  studentName: String,

  courseName: String,

  completionDate: {
    type: Date,
    default: Date.now
  },

  issueDate: {
    type: Date,
    default: Date.now
  },

  verificationUrl: String,

  grade: String,

  skills: [String]

}, { timestamps: true });


certificateSchema.pre('save', function(next) {

  if (!this.certificateId) {

    this.certificateId =
      "EDU-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase();

  }

  next();

});

module.exports = mongoose.model('Certificate', certificateSchema);