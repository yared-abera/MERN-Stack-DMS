const express = require('express');
const router = express.Router();
const chatController = require('../../controller/chatController/chat-Controller');
const chatMiddleware = require('../../middleware/chatMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create absolute path for uploads directory
const chatUploadsPath = path.join(process.cwd(), 'uploads', 'chat');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the directory exists
    if (!fs.existsSync(chatUploadsPath)) {
      fs.mkdirSync(chatUploadsPath, { recursive: true });
      console.log('Created chat uploads directory at:', chatUploadsPath);
    }
    console.log('Saving file to:', chatUploadsPath);
    cb(null, chatUploadsPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Chat routes - specific routes first
router.get('/messages/unread-count/:userId', chatMiddleware, chatController.getUnreadCount);
router.get('/messages/:roomId', chatMiddleware, chatController.getMessages);
router.put('/messages/mark-read', chatMiddleware, chatController.markAsRead);
router.post('/room', chatMiddleware, chatController.getChatRoom);
router.post('/message', chatMiddleware, upload.single('file'), chatController.sendMessage);
router.delete('/messages/:messageId', chatMiddleware, chatController.deleteMessage);

// No need to serve static files here as it's handled in app.js

module.exports = router; 