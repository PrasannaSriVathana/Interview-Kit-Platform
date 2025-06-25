// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  assessment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  type: { type: String, enum: ['mcq', 'coding'], required: true },
  question: { type: String, required: true },
  options: [String], // Only for MCQs
  correct_ans: mongoose.Schema.Types.Mixed, // Text or JSON depending on type
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] }
});

module.exports = mongoose.model('Question', questionSchema);
