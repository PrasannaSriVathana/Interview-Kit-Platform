// models/Certificate.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  certificate_url: { type: String, required: true },
  issued_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);
