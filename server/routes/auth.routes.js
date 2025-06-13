const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/auth.controller');
// Add to your auth.routes.js
const { protect } = require('../middleware/auth.middleware.js');

router.get('/home', protect, (req, res) => {
  res.status(200).json({
    success: true,
    authenticated: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username
    }
  });
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;