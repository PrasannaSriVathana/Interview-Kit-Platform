// models/Assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  recruiter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  duration_min: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
