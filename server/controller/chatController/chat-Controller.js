const { Message, ChatRoom } = require('../../model/chatModel/chatModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/chat';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer with only size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

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
      const { roomId, senderId, receiverId } = req.body;
      const message = req.body.text || ''; // Text message is optional if there's a file
      const file = req.file; // Multer adds file to req.file

      console.log('Raw request body:', req.body);
      console.log('Received message request:', { 
        roomId, 
        senderId, 
        receiverId, 
        hasFile: !!file 
      });

      if (!roomId || !senderId || !receiverId) {
        const missingFields = [];
        if (!roomId) missingFields.push('roomId');
        if (!senderId) missingFields.push('senderId');
        if (!receiverId) missingFields.push('receiverId');
        
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Check if there's either a message or a file
      if (!message && !file) {
        return res.status(400).json({
          success: false,
          message: 'Message or file is required'
        });
      }

      const chatRoom = await ChatRoom.findById(roomId);
      if (!chatRoom) {
        // Clean up file if uploaded
        if (file) {
          fs.unlinkSync(file.path);
        }
        return res.status(404).json({
          success: false,
          message: 'Chat room not found'
        });
      }

      console.log('Chat room participants:', chatRoom.participants);
      console.log('Checking participants - senderId:', senderId, 'receiverId:', receiverId);

      // Convert IDs to strings for comparison
      const participantIds = chatRoom.participants.map(p => p.toString());
      const senderIdStr = senderId.toString();
      const receiverIdStr = receiverId.toString();

      // Verify that both users are participants in the chat room
      if (!participantIds.includes(senderIdStr) || !participantIds.includes(receiverIdStr)) {
        // Clean up file if uploaded
        if (file) {
          fs.unlinkSync(file.path);
        }
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Users are not participants in this chat room',
          debug: {
            participants: participantIds,
            sender: senderIdStr,
            receiver: receiverIdStr
          }
        });
      }

      const newMessage = {
        sender: senderId,
        receiver: receiverId,
        message: message.trim(),
        timestamp: new Date()
      };

      // If there's a file, add file information to the message
      if (file) {
        console.log('Processing file:', file);
        newMessage.fileUrl = `/uploads/chat/${file.filename}`;
        newMessage.fileName = file.originalname;
        newMessage.fileType = file.mimetype;
      }

      console.log('Creating new message:', newMessage);

      const updatedRoom = await ChatRoom.findByIdAndUpdate(
        roomId,
        {
          $push: { messages: newMessage },
          $set: { lastMessage: new Date() }
        },
        { 
          new: true,
          runValidators: true // This ensures mongoose validation runs on update
        }
      ).populate('messages.sender messages.receiver', 'fName lName userName profileImage _id');

      // Get the newly added message
      const sentMessage = updatedRoom.messages[updatedRoom.messages.length - 1];
      console.log('Message saved successfully:', sentMessage);

      res.status(200).json({
        success: true,
        data: sentMessage
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      // If there was an error and a file was uploaded, try to delete it
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
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
  },

  // Get unread messages count
  getUnreadCount: async (req, res) => {
    try {
      const {userId} = req.params;
      
      if (!userId) {
        console.log('Missing userId in request');
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      console.log('Fetching unread count for user:', userId);

      // Find all chat rooms where the user is a participant
      const chatRooms = await ChatRoom.find({
        participants: userId
      });

      console.log('Found', chatRooms.length, 'chat rooms for user');

      // Count unread messages across all chat rooms
      let totalUnread = 0;
      chatRooms.forEach(room => {
        const unreadMessages = room.messages.filter(msg => 
          msg.receiver.toString() === userId && !msg.read
        );
        totalUnread += unreadMessages.length;
      });

      console.log('Total unread messages:', totalUnread);

      res.status(200).json({
        success: true,
        count: totalUnread
      });
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Delete a message
  deleteMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { roomId } = req.body;
      
      if (!messageId || !roomId) {
        return res.status(400).json({
          success: false,
          message: 'Message ID and Room ID are required'
        });
      }

      const chatRoom = await ChatRoom.findById(roomId);
      if (!chatRoom) {
        return res.status(404).json({
          success: false,
          message: 'Chat room not found'
        });
      }

      // Find and remove the message
      const result = await ChatRoom.findByIdAndUpdate(
        roomId,
        { 
          $pull: { 
            messages: { _id: messageId } 
          } 
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = chatController; 