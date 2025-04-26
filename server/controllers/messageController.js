const { Message, ChatRoom } = require('../model/chatModel/chatModel');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const sender = req.user.id;

    const chatRoom = await ChatRoom.findById(chatId);
    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found'
      });
    }

    // Get the receiver ID (the other participant)
    const receiver = chatRoom.participants.find(
      participant => participant.toString() !== sender.toString()
    );

    const newMessage = {
      sender,
      receiver,
      message,
      read: false
    };

    // Add message to chat room
    chatRoom.messages.push(newMessage);
    await chatRoom.save();

    // Populate the sender field
    const populatedRoom = await ChatRoom.findById(chatId)
      .populate('messages.sender messages.receiver', 'Fname Lname userName profileImage');

    res.status(201).json({
      success: true,
      data: populatedRoom.messages[populatedRoom.messages.length - 1]
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
    
    const chatRoom = await ChatRoom.findById(chatId)
      .populate('messages.sender messages.receiver', 'Fname Lname userName profileImage')
      .sort({ 'messages.timestamp': -1 });

    if (!chatRoom) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: chatRoom.getLatestMessages(50)
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get unread messages count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find all chat rooms where the user is a participant
    const chatRooms = await ChatRoom.find({
      participants: userId
    });

    // Count unread messages across all chat rooms
    let totalUnread = 0;
    chatRooms.forEach(room => {
      const unreadMessages = room.messages.filter(msg => 
        msg.receiver.toString() === userId && !msg.read
      );
      totalUnread += unreadMessages.length;
    });

    res.status(200).json({
      success: true,
      count: totalUnread
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    const result = await ChatRoom.findOneAndUpdate(
      { _id: roomId },
      {
        $set: {
          'messages.$[elem].read': true
        }
      },
      {
        arrayFilters: [{ 
          'elem.receiver': userId,
          'elem.read': false
        }],
        new: true
      }
    );

    res.status(200).json({
      success: true,
      data: { userId, updatedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 