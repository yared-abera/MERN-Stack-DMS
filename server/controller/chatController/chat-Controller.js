const { Message, ChatRoom } = require('../../model/chatModel/chatModel');

const chatController = {
  // Create or get chat room between two users
  getChatRoom: async (req, res) => {
    try {
      const { userId, receiverId } = req.body;
      
      let chatRoom = await ChatRoom.findOne({
        participants: { $all: [userId, receiverId] }
      }).populate('participants messages.sender messages.receiver');

      if (!chatRoom) {
        chatRoom = await ChatRoom.create({
          participants: [userId, receiverId],
          messages: []
        });
      }

      res.status(200).json(chatRoom);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Send a message
  sendMessage: async (req, res) => {
    try {
      const { roomId, senderId, receiverId, message } = req.body;

      const newMessage = {
        sender: senderId,
        receiver: receiverId,
        message,
        timestamp: new Date()
      };

      const updatedRoom = await ChatRoom.findByIdAndUpdate(
        roomId,
        {
          $push: { messages: newMessage },
          $set: { lastMessage: new Date() }
        },
        { new: true }
      ).populate('messages.sender messages.receiver');

      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get messages for a chat room
  getMessages: async (req, res) => {
    try {
      const { roomId } = req.params;
      const chatRoom = await ChatRoom.findById(roomId)
        .populate('messages.sender messages.receiver')
        .sort({ 'messages.timestamp': -1 });

      res.status(200).json(chatRoom.messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mark messages as read
  markAsRead: async (req, res) => {
    try {
      const { roomId, userId } = req.body;
      
      await ChatRoom.updateMany(
        { _id: roomId, 'messages.receiver': userId },
        { $set: { 'messages.$[elem].read': true } },
        { arrayFilters: [{ 'elem.read': false }] }
      );

      res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = chatController; 