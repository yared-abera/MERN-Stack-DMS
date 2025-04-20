const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: new Map()
    },
    isDeleted: {
        type: Map,
        of: Boolean,
        default: new Map()
    },
    type: {
        type: String,
        enum: ['direct', 'group'],
        default: 'direct'
    },
    groupName: {
        type: String,
        required: function() {
            return this.type === 'group';
        }
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() {
            return this.type === 'group';
        }
    }
}, { timestamps: true });

// Indexes for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessage: 1 });

module.exports = mongoose.model('Conversation', conversationSchema); 