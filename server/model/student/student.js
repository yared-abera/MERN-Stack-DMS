const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  id: { type: String, required: true, unique: true },
  batch: { type: Number, required: true },
  department: { type: String, required: true },
  address: { type: String, required: true },
  parentAddress: { type: String, required: true },
  parentPhoneNum: { type: String, required: true },
  isSpecial: { type: Boolean, default: false }, 
  disabilityStatus: { type: String,  enum: ["Yes", "No"], default: "None" },
  dormNum: { type: mongoose.Schema.Types.ObjectId, ref: "Dormitory", required: true }, // Foreign Key Reference
  blockNum: { type: mongoose.Schema.Types.ObjectId, ref: "Block", required: true }, // Foreign Key Referenc 
});

module.exports = mongoose.model("Student",studentSchema);
