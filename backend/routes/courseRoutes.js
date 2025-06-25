const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticate = require('../middleware/authMiddleware');

// 🧑‍🏫 Recruiter: Create a course
router.post('/create', authenticate, courseController.createCourse);

// 🧱 Recruiter/Admin: Add module to a course
router.post('/add-module', authenticate, courseController.addCourseModule);

// 🧑‍🎓 Candidate: Enroll in a course
router.post('/enroll', authenticate, courseController.enrollInCourse);

// 🌍 Public: Get all approved courses
router.get('/approved', courseController.getAllApprovedCourses);

// 🛡️ Admin: Approve a course
router.post('/approve', authenticate, courseController.approveCourse);

// 👤 Candidate: Get all enrolled courses
router.get('/my-courses', authenticate, courseController.getMyCourses);

router.post('/progress', authenticate, courseController.markModuleComplete);


module.exports = router;
