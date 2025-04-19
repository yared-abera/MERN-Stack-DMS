const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    sex: { type: String, required: true },
    description: { type: String, required: true }, // Corrected spelling
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);