const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem"
  },

  language: String,
  code: String,

  result: String,

  score: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Submission", submissionSchema);