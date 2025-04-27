const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Create required directories
const uploadsPath = path.join(process.cwd(), 'uploads');
const chatUploadsPath = path.join(uploadsPath, 'chat');

// Create directories if they don't exist
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log('Created uploads directory at:', uploadsPath);
}
if (!fs.existsSync(chatUploadsPath)) {
  fs.mkdirSync(chatUploadsPath);
  console.log('Created chat uploads directory at:', chatUploadsPath);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsPath));
console.log('Serving uploads from:', uploadsPath);

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./router/auth-router/auth-router'));
// ... other routes ...

module.exports = app; 