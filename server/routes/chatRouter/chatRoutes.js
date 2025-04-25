const express = require('express');
const router = express.Router();
const chatController = require('../../controller/chatController/chat-Controller');
 
// Individual chat routes
router.post('/room',  chatController.getChatRoom);
router.post('/message',  chatController.sendMessage);
router.get('/messages/:roomId',   chatController.getMessages);
router.put('/messages/read',   chatController.markAsRead);

// Group chat routes
// router.post('/group', protect, groupChatController.createGroup);
// router.get('/groups/:userId', protect, groupChatController.getUserGroups);
// router.post('/group/message', protect, groupChatController.addGroupMessage);
// router.get('/group/messages/:groupId', protect, groupChatController.getGroupMessages);

module.exports = router; 