// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  submitted_at: { type: Date, default: Date.now },
  score: Number,
  feedback: String
});

module.exports = mongoose.model('Submission', submissionSchema);
