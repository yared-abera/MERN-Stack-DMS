const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema); 