// models/MaintenanceIssue.js
const mongoose = require("mongoose");

const maintenanceIssueSchema = new mongoose.Schema({
  userInfo: {
    fName: { type: String, required: true },
    mName: { type: String, required: true },
    lName: { type: String, required: true },
    userName: { type: String, required: true },
    blockNumber: { type: String, required: true },
    roomNumber: { type: String, required: true },
    phoneNumber: {
      type: String
    },

  },
  issueTypes: [],
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MaintenanceIssue", maintenanceIssueSchema);