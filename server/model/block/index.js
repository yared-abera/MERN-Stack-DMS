const mongoose = require("mongoose");

// Dorm Schema (nested under floors)
const dormSchema = new mongoose.Schema({
  dormNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  studentsAllocated: { type: Number, default: 0 },
  dormStatus: { 
    type: String, 
    enum: ["Available", "Full","MaintenanceIssue",'UnAvailable'], 
    default: "Available" ,

  },

  description: { type: String, default: "" },
  registerBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  registerDate: { type: Date, default: Date.now },
  
  totalAvailable: { type: Number, default: 0 }
});

dormSchema.pre("save", function(next) {
  this.totalAvailable = this.capacity - this.studentsAllocated;
  this.dormStatus = this.totalAvailable > 0 ? "Available" : "Full";
  next();
});

// Floor Schema (nested under blocks)
const floorSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true },
  floorCapacity: { type: Number, default: 0 },
  floorStatus: { 
    type: String, 
    enum: ["Available", "Unavailable"], 
    default: "Available" 
  },
  totalAvailable: { type: Number, default: 0 },
  dorms: [dormSchema]
});

floorSchema.pre("save", function(next) {
  // Calculate floor capacity from dorms
  this.floorCapacity = this.dorms.reduce(
    (sum, dorm) => sum + dorm.capacity, 
    0
  );
  
  // Calculate available beds
  this.totalAvailable = this.dorms.reduce(
    (sum, dorm) => sum + dorm.totalAvailable, 
    0
  );
  
  this.floorStatus = this.totalAvailable > 0 ? "Available" : "Unavailable";
  next();
});

// Block Schema
const blockSchema = new mongoose.Schema({
  blockNum: { type: Number, required: true, unique: true },
  location: { 
    type: String, 
    enum: ["maleArea", "femaleArea"], 
    required: true 
  },
  floors: [floorSchema],
  isSelectedForSpecial: { type: Boolean, default: false },
  status: { type: String, default: "Available" },
  totalAvailable: { type: Number, default: 0 },
  totalCapacity: { type: Number, default: 0 },
  totalFloors: { type: Number },
  assignedProctors: [{     
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  registerBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  registerDate: { type: Date, default: Date.now },
});

blockSchema.pre("save", function(next) {
  // Sum available spaces from floors
  this.totalAvailable = this.floors.reduce(
    (total, floor) => total + floor.totalAvailable, 
    0
  );
  
  // Sum pre-calculated floor capacities
  this.totalCapacity = this.floors.reduce(
    (total, floor) => total + floor.floorCapacity,
    0
  );
  
  this.status = this.totalAvailable > 0 ? "Available" : "Full";
  next();
});

blockSchema.index({ assignedProctors: 1 });

module.exports = mongoose.model("Block", blockSchema);