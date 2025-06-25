const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

//refresh token
router.post('/refresh', authController.refreshToken);

//logout
router.post('/logout', authController.logoutUser);


module.exports = router;
