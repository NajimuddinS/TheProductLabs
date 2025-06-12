require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: '*', // Your frontend URL
  credentials: true
}));

// Replace the mongoose.connect part in server.js with:
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));