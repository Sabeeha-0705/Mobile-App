const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Video = require('../models/Video');
const User = require('../models/User');

router.get('/:courseId', protect, async (req, res) => {

  try {

    let progress = await Progress.findOne({
      userId: req.user.id,
      courseId: req.params.courseId
    }).populate('completedVideos.videoId');

    if (!progress) {

      progress = await Progress.create({
        userId: req.user.id,
        courseId: req.params.courseId
      });

    }

    res.json({
      success: true,
      progress
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


router.post('/video-complete', protect, async (req, res) => {

  try {

    const { courseId, videoId, watchTime } = req.body;

    let progress = await Progress.findOne({
      userId: req.user.id,
      courseId
    });

    if (!progress) {

      progress = await Progress.create({
        userId: req.user.id,
        courseId
      });

    }

    const alreadyCompleted = progress.completedVideos.some(
      v => v.videoId.toString() === videoId
    );

    if (!alreadyCompleted) {

      progress.completedVideos.push({
        videoId,
        completedAt: new Date(),
        watchTime
      });

      const totalVideos = await Video.countDocuments({ courseId });

      const completedCount = progress.completedVideos.length;

      progress.completionPercentage =
        Math.round((completedCount / totalVideos) * 100);

      progress.timeSpent += watchTime || 0;

      progress.lastAccessedAt = new Date();

      await progress.save();

    }

    res.json({
      success: true,
      progress
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


router.post('/quiz-complete', protect, async (req, res) => {

  try {

    const { courseId, score, totalQuestions } = req.body;

    const progress = await Progress.findOne({
      userId: req.user.id,
      courseId
    });

    if (!progress) {

      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });

    }

    const course = await Course.findById(courseId);

    const percentage = (score / totalQuestions) * 100;

    const passed = percentage >= course.quiz.passingScore;

    progress.quizScore = {
      score,
      totalQuestions,
      passed,
      attemptedAt: new Date()
    };

    if (passed && progress.completionPercentage === 100) {

      progress.isCompleted = true;
      progress.completedAt = new Date();

      const user = await User.findById(req.user.id);

      if (!user.completedCourses.includes(courseId)) {

        user.completedCourses.push(courseId);
        user.totalPoints += 100;

        await user.save();

      }

    }

    await progress.save();

    res.json({
      success: true,
      progress,
      passed,
      courseCompleted: progress.isCompleted
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


router.get('/user/all', protect, async (req, res) => {

  try {

    const allProgress = await Progress.find({
      userId: req.user.id
    }).populate('courseId');

    res.json({
      success: true,
      count: allProgress.length,
      progress: allProgress
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

module.exports = router;