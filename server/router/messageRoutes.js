const express = require("express");
const router = express.Router();
const {
  createConversation,
  getUserConversations,
  addMessage,
  getConversationMessages,
  markMessagesAsRead,
} = require("../controller/messageController/index");

// Conversation routes
router.post("/conversations", createConversation);
router.get("/conversations/:userId", getUserConversations);

// Message routes
router.post("/", addMessage);
router.get("/:conversationId", getConversationMessages);
router.put("/:conversationId/read/:userId", markMessagesAsRead);

module.exports = router; 