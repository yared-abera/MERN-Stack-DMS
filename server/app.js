const express = require('express');
const path = require('path');
const fs = require('fs');

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

// ... rest of your app configuration ... 