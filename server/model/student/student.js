const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fName: { type: String, required: true },
  mName: { type: String, required: true },
  lName: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  phoneNum: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Student", "Manager"], required: true },
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

module.exports = mongose.model("User",userSchema);
