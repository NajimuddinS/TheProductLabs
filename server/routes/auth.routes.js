const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/auth.controller');
// Add to your auth.routes.js
const { protect } = require('../middleware/auth.middleware.js');

router.get('/home', protect, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user // Use the freshly attached user data
  });
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;