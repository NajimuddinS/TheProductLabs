const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware.js');

// This route should be in auth routes since it's being called from frontend
router.get('/verify', protect, (req, res) => {
  res.status(200).json({
    authenticated: true,
    user: {
      email: req.user.email,
      username: req.user.username,
      _id: req.user._id
    }
  });
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;