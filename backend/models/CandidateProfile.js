// models/CandidateProfile.js
const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  education: { type: String },
  experience: { type: String },
  resume_url: { type: String }
});

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
