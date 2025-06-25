// models/CourseModule.js
const mongoose = require('mongoose');

const courseModuleSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'quiz', 'code'], required: true },
  content_url: { type: String },
  order_index: { type: Number, required: true }
});

module.exports = mongoose.model('CourseModule', courseModuleSchema);
