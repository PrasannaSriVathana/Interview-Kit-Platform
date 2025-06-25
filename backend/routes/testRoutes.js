const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

router.get('/protected', authenticate, (req, res) => {
  res.json({
    message: 'You are authorized!',
    user: req.user
  });
});

module.exports = router;
