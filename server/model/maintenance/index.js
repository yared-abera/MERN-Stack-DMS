// models/MaintenanceIssue.js
const mongoose = require("mongoose");

const maintenanceIssueSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'userModel' // this tells Mongoose to use the value of userModel to determine which model to populate
  },
  userModel: { 
    type: String, 
    required: true, 
    enum: ['User', 'Student'] // Only these two models are allowed
  },
  userInfo: {
    fName: { type: String, required: true },
    mName: { type: String, required: true },
    lName: { type: String, required: true },
    sex: { type: String, required: true },
    userName: { type: String, required: true },
    blockNumber: { type: String, required: true },
    roomNumber: { type: String, required: true },
    phoneNumber: { type: String },
  },
  issueTypes: [{
    issue:String,
    status: {
      type: String,
      
      enum: ["Pending", "InProgress", "Resolved","Rejected","verified","Pass"],
      default: "Pending",
     
    },
    description: { type: String,  },
  
    createdAt: { type: Date, default: Date.now },
 
  }],
 
 
},{timestamps:true});


module.exports = mongoose.model("MaintenanceIssue", maintenanceIssueSchema);
