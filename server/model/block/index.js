const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
    blockNum: { type: Number,required: true },
    proctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Proctor", required: true },
});

module.exports = mongoose.model("Block", blockSchema);