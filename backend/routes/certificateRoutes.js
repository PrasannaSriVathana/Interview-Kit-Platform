const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const authenticate = require('../middleware/authMiddleware');

// Candidate: Generate certificate
router.post('/generate', authenticate, certificateController.generateCertificate);

// Candidate: View all certificates
router.get('/my-certificates', authenticate, certificateController.getMyCertificates);

module.exports = router;
