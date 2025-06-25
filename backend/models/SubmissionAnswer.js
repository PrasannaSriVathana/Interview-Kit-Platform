// models/SubmissionAnswer.js
const mongoose = require('mongoose');

const submissionAnswerSchema = new mongoose.Schema({
  submission_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: String },
  score: { type: Number }
});

module.exports = mongoose.model('SubmissionAnswer', submissionAnswerSchema);
