//backend/routes/user.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses')
      .populate('completedCourses');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, avatar },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { theme, notifications } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        'preferences.theme': theme,
        'preferences.notifications': notifications
      },
      { new: true }
    );

    res.json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/user/enroll/:courseId
// @desc    Enroll in a course
// @access  Private
router.post('/enroll/:courseId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.enrolledCourses.includes(req.params.courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    user.enrolledCourses.push(req.params.courseId);
    await user.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/user/stats
// @desc    Get user stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses')
      .populate('completedCourses');

    const stats = {
      enrolledCoursesCount: user.enrolledCourses.length,
      completedCoursesCount: user.completedCourses.length,
      totalPoints: user.totalPoints,
      currentStreak: user.streak.current,
      longestStreak: user.streak.longest
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
