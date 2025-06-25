const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authMiddleware');

// Candidate
router.get('/candidate', authenticate, dashboardController.getCandidateDashboard);

// Recruiter
router.get('/recruiter', authenticate, dashboardController.getRecruiterDashboard);

// Admin
router.get('/admin', authenticate, dashboardController.getAdminDashboard);

module.exports = router;
