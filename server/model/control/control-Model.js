const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema(
  {
    // Reference to the student the issue is about
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Refers to the User model
      required: true,
      index: true, // Indexing helps when querying issues by student
    },
    // Reference to the proctor who reported the issue
    proctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the User model
      required: true,
      index: true, // Indexing helps when querying issues by proctor
    },
    Allissues: [
      {
        issue: {
          type: String,
          required: true,
          trim: true,
          maxLength: 15, // Matches frontend validation hint
        },

        description: {
          type: String,
          required: true,
          trim: true,
          maxLength: 50, // Matches frontend validation hint
        },

        dateReported: {
          type: Date,
          default: Date.now, // Automatically sets the current date when created
        },
        status: {
          type: String,
          enum: ["open", "InProgress",  "closed","passed"], // Example statuses
          default: "open",
        },
      },
    ],

 

    // Add other fields relevant to an issue report (e.g., severity, action taken)
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Control", IssueSchema);
