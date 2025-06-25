const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const authenticate = require('../middleware/authMiddleware');

// 🧑‍💼 Recruiter: Create assessment
router.post('/create', authenticate, assessmentController.createAssessment);

// 🧑‍💼 Recruiter: Add question
router.post('/add-question', authenticate, assessmentController.addQuestion);

// 👀 Candidate: Get questions (no answers)
router.get('/questions/:assessment_id', authenticate, assessmentController.getAssessmentQuestions);

// 🧑‍🎓 Candidate: Submit assessment
router.post('/submit', authenticate, assessmentController.submitAssessment);

// 🧑‍💼 Recruiter: View submissions
router.get('/submissions/:assessment_id', authenticate, assessmentController.viewSubmissions);

module.exports = router;
