//backend/routes/uploader.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const Video = require('../models/Video');
const User = require('../models/User');

// @route   GET /api/uploader/courses
// @desc    Get all courses by uploader
// @access  Private/Uploader
router.get('/courses', protect, authorize('uploader'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('videos')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/uploader/stats
// @desc    Get uploader statistics
// @access  Private/Uploader
router.get('/stats', protect, authorize('uploader'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    const stats = {
      totalCourses: courses.length,
      totalStudents: courses.reduce((acc, course) => acc + course.enrolledCount, 0),
      publishedCourses: courses.filter(c => c.isPublished).length,
      draftCourses: courses.filter(c => !c.isPublished).length,
      totalRevenue: courses.reduce((acc, course) => {
        return acc + (course.isPaid ? course.price * course.enrolledCount : 0);
      }, 0)
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

// @route   GET /api/uploader/earnings
// @desc    Get earnings breakdown
// @access  Private/Uploader
router.get('/earnings', protect, authorize('uploader'), async (req, res) => {
  try {
    const courses = await Course.find({ 
      instructor: req.user.id,
      isPaid: true 
    });

    const earnings = courses.map(course => ({
      courseId: course._id,
      courseName: course.title,
      price: course.price,
      enrollments: course.enrolledCount,
      revenue: course.price * course.enrolledCount
    }));

    const totalEarnings = earnings.reduce((acc, item) => acc + item.revenue, 0);

    res.json({
      success: true,
      totalEarnings,
      earnings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/uploader/course/:id/publish
// @desc    Toggle course publish status
// @access  Private/Uploader
router.put('/course/:id/publish', protect, authorize('uploader'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
