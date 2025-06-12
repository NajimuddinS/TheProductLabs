const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getHome } = require('../controllers/home.controller');

router.get('/', protect, getHome);

module.exports = router;