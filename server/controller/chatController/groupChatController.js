const GroupChat = require('../models/GroupChat');
const User = require('../models/User');

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, members, createdBy } = req.body;

    // Create new group
    const group = await GroupChat.create({
      name,
      members: [...members, createdBy], // Include creator in members
      createdBy
    });

    // Populate creator and members info
    const populatedGroup = await GroupChat.findById(group._id)
      .populate('members', 'Fname Lname userName')
      .populate('createdBy', 'Fname Lname userName');

    res.status(201).json({
      success: true,
      group: {
        ...populatedGroup.toObject(),
        groupId: populatedGroup._id,
        groupName: populatedGroup.name,
        isGroup: true
      }
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating group',
      error: error.message
    });
  }
};

// Get user's groups
exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    const groups = await GroupChat.find({ members: userId })
      .populate('members', 'Fname Lname userName')
      .populate('createdBy', 'Fname Lname userName')
      .populate('lastMessage.sender', 'Fname Lname userName');

    const formattedGroups = groups.map(group => ({
      ...group.toObject(),
      groupId: group._id,
      groupName: group.name,
      isGroup: true
    }));

    res.json({
      success: true,
      groups: formattedGroups
    });
  } catch (error) {
    console.error('Get user groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching groups',
      error: error.message
    });
  }
};

// Add message to group
exports.addGroupMessage = async (req, res) => {
  try {
    const { groupId, senderId, message } = req.body;

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({
        success: false,
        message: 'Sender not found'
      });
    }

    const group = await GroupChat.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Create new message
    const newMessage = {
      sender: senderId,
      message,
      timestamp: new Date(),
      read: [senderId] // Mark as read by sender
    };

    // Add message to group
    group.messages.push(newMessage);
    
    // Update last message
    group.lastMessage = {
      message,
      timestamp: new Date(),
      sender: senderId
    };

    await group.save();

    // Populate sender info for the response
    const populatedMessage = {
      ...newMessage,
      senderName: `${sender.Fname} ${sender.Lname}`.trim() || sender.userName
    };

    res.json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Add group message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding message to group',
      error: error.message
    });
  }
};

// Get group messages
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await GroupChat.findById(groupId)
      .populate('messages.sender', 'Fname Lname userName');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    const messages = group.messages.map(msg => ({
      ...msg.toObject(),
      senderName: `${msg.sender.Fname} ${msg.sender.Lname}`.trim() || msg.sender.userName
    }));

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching group messages',
      error: error.message
    });
  }
}; 