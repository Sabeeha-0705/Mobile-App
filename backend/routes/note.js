const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Note = require('../models/Note');


// GET ALL NOTES
router.get('/', protect, async (req, res) => {
  try {

    const notes = await Note.find({ userId: req.user.id })
      .populate('courseId', 'title')
      .populate('videoId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});


// GET COURSE NOTES
router.get('/course/:courseId', protect, async (req, res) => {
  try {

    const notes = await Note.find({
      userId: req.user.id,
      courseId: req.params.courseId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});


// CREATE NOTE
router.post('/', protect, async (req, res) => {
  try {

    const { title, content, courseId, videoId } = req.body;

    const note = await Note.create({
      title,
      content,
      courseId,
      videoId,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      note
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});


// UPDATE NOTE
router.put('/:id', protect, async (req, res) => {
  try {

    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({
      success: true,
      note
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});


// DELETE NOTE
router.delete('/:id', protect, async (req, res) => {
  try {

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: "Note deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

module.exports = router;