const Conversation = require("../../model/message/conversation");
const Message = require("../../model/message/message");

// Create a new conversation
const createConversation = async (req, res) => {
  try {
    // Check if a conversation already exists between these two users
    const existingConversation = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create a new conversation
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get conversations for a user
const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).sort({ updatedAt: -1 });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add message
const addMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    
    // Update the conversation's last message and timestamp
    await Conversation.findByIdAndUpdate(
      req.body.conversationId,
      { 
        lastMessage: req.body.text,
        $inc: { unreadCount: 1 }
      }
    );
    
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get messages for a conversation
const getConversationMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId, userId } = req.params;
    
    // Update all unread messages in this conversation that were not sent by this user
    await Message.updateMany(
      { 
        conversationId, 
        read: false,
        sender: { $ne: userId } 
      },
      { read: true }
    );
    
    // Reset unread count for this conversation
    await Conversation.findByIdAndUpdate(
      conversationId,
      { unreadCount: 0 }
    );
    
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  addMessage,
  getConversationMessages,
  markMessagesAsRead,
}; 