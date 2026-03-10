const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ['learner', 'uploader'], 
    default: 'learner' 
  },
  isEmailVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  googleId: String,
  avatar: String,
  preferences: {
    theme: { 
      type: String, 
      enum: ['light', 'dark'], 
      default: 'light' 
    },
    notifications: { 
      type: Boolean, 
      default: true 
    }
  },
  enrolledCourses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  completedCourses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  streak: { 
    current: { type: Number, default: 0 }, 
    longest: { type: Number, default: 0 }, 
    lastActive: Date 
  },
  totalPoints: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if OTP is valid
userSchema.methods.isOTPValid = function(otp) {
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  if (this.otp.code !== otp) {
    return false;
  }
  if (new Date() > this.otp.expiresAt) {
    return false;
  }
  return true;
};

module.exports = mongoose.model('User', userSchema);
