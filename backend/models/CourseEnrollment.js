// models/CourseEnrollment.js
const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  progress: { type: Number, default: 0.0 },
  completed: { type: Boolean, default: false },
  certificate_url: { type: String },
  enrolled_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
