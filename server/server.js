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

// CORS configuration - MUST be before other middleware
const corsOptions = {
  origin: [
    'http://localhost:5173',          // Local development
    'http://localhost:3000',          // Alternative local port
    'https://your-frontend-domain.com' // Add your production domain here
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cookie',
    'Set-Cookie',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log('Request Method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request Origin:', req.get('Origin'));
  console.log('Cookies received:', req.cookies);
  next();
});

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});