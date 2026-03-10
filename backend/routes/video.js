//backend/routes/video.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const Video = require('../models/Video');
const Course = require('../models/Course');

const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/* ---------------- MULTER CONFIG ---------------- */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024
  }
});

/* ---------------- GET VIDEOS OF COURSE ---------------- */

router.get('/course/:courseId', async (req, res) => {

  try {

    const videos = await Video.find({
      courseId: req.params.courseId
    }).sort({ order: 1 });

    res.json({
      success: true,
      count: videos.length,
      videos
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

/* ---------------- ADD VIDEO ---------------- */

router.post(
  '/',
  protect,
  authorize('uploader'),
  upload.single('video'),

  async (req, res) => {

    try {

      const { title, description, courseId, order, isPreview, youtubeUrl } = req.body;

      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      if (course.instructor.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized"
        });
      }

      let videoUrl = "";

      if (youtubeUrl && youtubeUrl.trim() !== "") {

        videoUrl = youtubeUrl;

      } else if (req.file) {

        const result = await cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type: "video",
            folder: "eduoding_videos"
          }
        );

        videoUrl = result.secure_url;

        fs.unlink(req.file.path, () => { });

      } else {

        return res.status(400).json({
          success: false,
          message: "Upload video file OR provide YouTube URL"
        });

      }

      const video = await Video.create({
        title,
        description,
        videoUrl,
        courseId,
        order,
        isPreview
      });

      course.videos.push(video._id);
      await course.save();

      res.status(201).json({
        success: true,
        video
      });

    } catch (error) {

      console.log("VIDEO UPLOAD ERROR:", error);

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }

);

/* ---------------- DELETE VIDEO ---------------- */

router.delete(
  '/:id',
  protect,
  authorize('uploader'),

  async (req, res) => {

    try {

      const video = await Video.findById(req.params.id);

      if (!video) {
        return res.status(404).json({
          success: false,
          message: "Video not found"
        });
      }

      const course = await Course.findById(video.courseId);

      if (course.instructor.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized"
        });
      }

      course.videos = course.videos.filter(
        v => v.toString() !== req.params.id
      );

      await course.save();
      await video.deleteOne();

      res.json({
        success: true,
        message: "Video deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }

);

module.exports = router;