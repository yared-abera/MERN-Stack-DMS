const express = require('express');
const router = express.Router();
const chatController = require('../../controller/chatController/chat-Controller');
//const groupChatController = require('../controllers/groupChatController');
const  auth = require('../../middleware/auth');

// Individual chat routes
router.post('/room', auth, chatController.getChatRoom);
router.post('/message', auth, chatController.sendMessage);
router.get('/messages/:roomId', auth, chatController.getMessages);
router.put('/messages/read', auth, chatController.markAsRead);

// Group chat routes
// router.post('/group', protect, groupChatController.createGroup);
// router.get('/groups/:userId', protect, groupChatController.getUserGroups);
// router.post('/group/message', protect, groupChatController.addGroupMessage);
// router.get('/group/messages/:groupId', protect, groupChatController.getGroupMessages);

module.exports = router; 