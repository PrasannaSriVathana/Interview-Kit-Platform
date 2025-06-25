// models/RecruiterProfile.js
const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  company_name: { type: String, required: true },
  position: { type: String },
  website: { type: String }
});

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
