//backend/controllers/leaderboardController.js
const Submission = require("../models/Submission");

exports.getLeaderboard = async (req, res) => {

  const leaderboard = await Submission.aggregate([
    {
      $group: {
        _id: "$userId",
        totalScore: { $sum: "$score" },
        solved: { $sum: 1 }
      }
    },
    { $sort: { totalScore: -1 } }
  ]);

  res.json({
    success: true,
    leaderboard
  });

};