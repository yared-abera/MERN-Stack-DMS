const mongoose = require("mongoose");

const DormSchema = new mongoose.Schema({
  dorm_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  dormNum: {
    type: Number,
    unique: true,
  },
  blockID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block",
    required: true,
  },
  blockNum: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  available_beds: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["Available", "Occupied"],
    default: "Available",
  },
});

module.exports = mongoose.model("Dorm", DormSchema);
