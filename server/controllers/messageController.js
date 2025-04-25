const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const sender = req.user.id; // Get sender from authenticated user

    const newMessage = await Message.create({
      chat: chatId,
      sender,
      message
    });

    // Populate the sender field
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email');

    // Update the chat's lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: newMessage._id
    });

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get messages for a chat
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email')
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 