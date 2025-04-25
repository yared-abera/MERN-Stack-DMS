const express = require('express');
const router = express.Router();
const chatController = require('../../controller/chatController/chat-Controller');
const chatMiddleware = require('../../middleware/chatMiddleware');

// Individual chat routes
router.post('/room', chatMiddleware, chatController.getChatRoom);
router.post('/message', chatMiddleware, chatController.sendMessage);
router.get('/messages/:roomId', chatMiddleware, chatController.getMessages);
router.put('/messages/read', chatMiddleware, chatController.markAsRead);

// Group chat routes
// router.post('/group', protect, groupChatController.createGroup);
// router.get('/groups/:userId', protect, groupChatController.getUserGroups);
// router.post('/group/message', protect, groupChatController.addGroupMessage);
// router.get('/group/messages/:groupId', protect, groupChatController.getGroupMessages);

module.exports = router; 