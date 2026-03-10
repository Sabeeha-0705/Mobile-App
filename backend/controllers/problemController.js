//backend/controllers/problemController.js
const Problem = require("../models/Problem");

exports.getProblems = async (req, res) => {

  const { language } = req.query;

  const problems = await Problem.find({ language });

  res.json({
    success: true,
    problems
  });

};

exports.getProblem = async (req, res) => {

  const problem = await Problem.findById(req.params.id);

  res.json({
    success: true,
    problem
  });

};