const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Foreign Key Reference
    userName: { type: String, required: true },  
    email: { type: String, required: true },
    dormNum: { type: String, required: true },
    blockNum: { type: String, required: true },
    status: { type: String, enum: ["Pending","In Progress","Completed"], default: "Pending" },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true }
  });
 
  module.exports = mongoose.model("Maintenance", maintenanceSchema);
