const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  Fname: { type: String, required: true },
  Lname: { type: String, required: true },
  Mname: { type: String, required: true },
  email: { type: String, },
  userName: { type: String, required: true, unique: true },
  batch: { type: Number,  },
  password: { type: String, },
  department: { type: String },

  phoneNum: { type: Number, required:false },
  sex: { type: String, required: true },
  stream: { type: String, required: true },
  collage: { type: String },
  studCategory: { type: String },
  role: { type: String, default: 'student' },
  isSpecial: { type: String, enum: ["Yes", "No","None"], default: "None" },
  disabilityStatus: { type: String, enum: ["Yes", "No","None"], default: "None" },
  emergencyContactNumber: { type:Number, required: false },  
  parentFirstName: { type: String, required:false },
  parentLastName: { type: String, required: false },
  parentPhone: { type: Number, required:false },
  parentAddress: { type: String, required:false },
  keyHolder: { type:Boolean, required:false},
  arrivalDate: { type: Date, required: false },
  status: { type:Boolean, default: false },
  lastUpdated: { type: Date, required: false },
  registeredBy: { type: String, required: false },
  
  // Reference to the Block document containing the dorm
  blockNum: {
    type: Number,
  },
  // Identifiers for the assigned dorm (embedded within a block)
  dormId: { 
    type:Number, // the _id of the dorm subdocument
     
  },
  absenceDates:  [{ type: Date }],
  address:{
    country: { type: String, default: 'Ethiopia' },
    city: { type: String, default: '' },
  },

  socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      telegram: { type: String, default: '' },
      linkedin: { type: String, default: '' }
  }
  // floorNumber: { type: Number, } 
},{ timestamps: true });



module.exports = mongoose.model("Student", studentSchema);