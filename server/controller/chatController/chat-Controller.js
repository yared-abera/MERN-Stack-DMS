const { Message, ChatRoom } = require('../../model/chatModel/chatModel');

const chatController = {
  // Create or get chat room between two users
  getChatRoom: async (req, res) => {
    try {
      const { userId, receiverId } = req.body;
      
      if (!userId || !receiverId) {
        return res.status(400).json({ 
          success: false,
          message: 'Both userId and receiverId are required' 
        });
      }

      let chatRoom = await ChatRoom.findOne({
        participants: { $all: [userId, receiverId] }
      }).populate('participants messages.sender messages.receiver', 'Fname Lname userName profileImage');

      if (!chatRoom) {
        chatRoom = await ChatRoom.create({
          participants: [userId, receiverId],
          messages: []
        });
        chatRoom = await chatRoom.populate('participants', 'Fname Lname userName profileImage');
      }

      res.status(200).json({
        success: true,
        data: chatRoom
      });
    } catch (error) {
      console.error('Error in getChatRoom:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  // Send a message
  sendMessage: async (req, res) => {
    try {
      const { roomId, senderId, receiverId, message } = req.body;

      if (!roomId || !senderId || !receiverId || !message) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const chatRoom = await ChatRoom.findById(roomId);
      if (!chatRoom) {
        return res.status(404).json({
          success: false,
          message: 'Chat room not found'
        });
      }

      const newMessage = {
        sender: senderId,
        receiver: receiverId,
        message: message.trim(),
        timestamp: new Date()
      };

      const updatedRoom = await ChatRoom.findByIdAndUpdate(
        roomId,
        {
          $push: { messages: newMessage },
          $set: { lastMessage: new Date() }
        },
        { new: true }
      ).populate('messages.sender messages.receiver', 'Fname Lname userName profileImage');

      res.status(200).json({
        success: true,
        data: updatedRoom
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get messages for a chat room
  getMessages: async (req, res) => {
    try {
      const { roomId } = req.params;
      
      if (!roomId) {
        return res.status(400).json({
          success: false,
          message: 'Room ID is required'
        });
      }

      const chatRoom = await ChatRoom.findById(roomId)
        .populate('messages.sender messages.receiver', 'Fname Lname userName profileImage')
        .sort({ 'messages.timestamp': -1 });

      if (!chatRoom) {
        return res.status(404).json({
          success: false,
          message: 'Chat room not found'
        });
      }

      res.status(200).json({
        success: true,
        data: chatRoom.getLatestMessages(50)
      });
    } catch (error) {
      console.error('Error in getMessages:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Mark messages as read
  markAsRead: async (req, res) => {
    try {
      const { roomId, userId } = req.body;
      
      if (!roomId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Both roomId and userId are required'
        });
      }

      const result = await ChatRoom.updateMany(
        { _id: roomId, 'messages.receiver': userId },
        { $set: { 'messages.$[elem].read': true } },
        { 
          arrayFilters: [{ 'elem.read': false }],
          new: true
        }
      );

      res.status(200).json({
        success: true,
        message: 'Messages marked as read',
        data: result
      });
    } catch (error) {
      console.error('Error in markAsRead:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = chatController; 