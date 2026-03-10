//backend/models/Problem.js
const mongoose = require("mongoose");

const testcaseSchema = new mongoose.Schema({
  input: String,
  output: String
});

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  language: String,
  difficulty: String,
  starterCode: String,
  testcases: [testcaseSchema],
  points: Number
});

module.exports = mongoose.model("Problem", problemSchema);