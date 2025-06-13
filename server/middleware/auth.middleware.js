const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const protect = async (req, res, next) => {
  const token = req.cookies?.jwt;
  
  if (!token) {
    console.log('No token found in cookies');
    return res.sendStatus(401); // More standard response
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('User not found in database');
      return res.sendStatus(401);
    }

    // Attach fresh user data
    req.user = {
      _id: user._id,
      email: user.email,
      username: user.username
    };
    
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    
    // Specific error handling
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired' });
    }
    return res.sendStatus(401);
  }
};

module.exports = { protect };