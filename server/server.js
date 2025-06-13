require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Only call this once

// Debug middleware (optional - remove in production)
app.use((req, res, next) => {
  console.log('Cookies received:', req.cookies);
  next();
});

app.use(cors({
  origin: true, // Replace with actual frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));